var queries = {};
if (document.location.search.substring(1).length > 0) {
    $.each(document.location.search.substr(1).split('&'), function(a,b) {
        var i = b.split('=');
        if (i.length > 1) {
            queries[i[0].toString()] = i[1].toString();
        }
    });
}

$('#select_l').change(function() {
    window.location = '/3ds/homebrew/' + $(this).val();
});

$.getJSON(json_file, function(json) {
    var stats = {
        app: 0, game: 0, emu: 0,
        cfw: 0, rl: 0, wip: 0,
        finished: 0, discontinued: 0
    };

    $.each(json, function() {
        stats[this.type]++;
        stats[this.status]++;
        if (this.date != "0") {
            stats.rl++;
        }
        $('.list').append(
            '<li class="'+this.type+'">' +
            '<div id="'+$(json).index(this)+'">' +
            '<span class="icon"><img src="/3ds/homebrew/icons/'+$(json).index(this)+'.png"/></span>' +
            '<span class="vdata title"><b>'+this.title+'</b></span>' +
            '<span class="vdata desc">'+this.desc+'</span>' +
            '<span class="vdata author">Author: '+this.author+'</span>' +
            '<span class="hdata tags">'+this.tags+'</span>' +
            '<span class="hdata release">'+this.date+'</span>' +
            '<span class="hdata cat">'+this.type+'</span>' +
            '<span class="hdata status">'+(this.status.length===0 ? 'unknown' : this.status)+'</span>' +
            '</div></li>'
        );
    });

    var id;

    $('.icon img').error(function() {
        if ($(this).attr('src')!='/3ds/homebrew/icons/noicon.png') {
                $(this).attr('src', '/3ds/homebrew/icons/noicon.png');
            }
        });

        $('.screenshot img').error(function() {
            if ($(this).attr('src')!='/3ds/homebrew/screenshots/noscreen.png') {
                $(this).attr('src', '/3ds/homebrew/screenshots/noscreen.png');
            }
        });

    $('.screenshot').click(function() {
        $('.details p, .details h1, .details table, .details span:not(.screenshot)').fadeOut(120);
        $('.screenshot img').animate({
            width: $('.screenshot img').css('width') == '120px' ? 400 : 120}, 360);
        if ($('.screenshot img').css('width') != '120px') {
            $('.details *' + ($('.show').hasClass('less') ? ':not(.compat)' : '')).fadeIn(500);
        }
    });

    function showDetails() {
        $('.details, .details *').fadeIn(500);
        $('.screenshot img').css('width', '120px');
        $('.details .icon img').attr('src', '/3ds/homebrew/icons/'+id+'.png');
        $('.details #title').html(json[id].title);
        $('.details #title').css('fontSize', 36 - Math.floor(json[id].title.length / 2.5));
        $('.details #author').html(json[id].author);
        var year = json[id].date.substring(0,4);
        var month = monthstr[parseInt(json[id].date.substring(4,6))];
        var day = json[id].date.substring(6,8);
        var date = (json[id].date=="0") ? str_unreleased : (json[id].date.length===0) ? str_unknown : getDate(day, month, year);
        $('.details #release').html(date);
        $('.details #devst').html(getDevStatus(json[id].status));
        $('.details #version').html(date!=str_unreleased ? (json[id].ver.length > 0 ? json[id].ver : str_unknown) : '-');
        $('.details #site').html(json[id].site.length > 0 ? ('<a href="'+json[id].site+'" target="_blank">'+'<img src="/3ds/homebrew/btm_e.png"/>'+'</a>') : '-');
        $('.details .desc').css('font-size', json[id].long.length > 550 ? '11pt' : '12.5pt');
        if (json[id].long.length > 256) {
            $('.details .desc').html(json[id].long.substring(0,240) + '\u2026 ');
            $('.show').addClass('more');
            $('.show').removeClass('less');
            $('.show').show();
        } else {
            $('.details .desc').html(json[id].long.length > 0 ? json[id].long : json[id].desc);
            $('.show').hide();
            $('.show').removeClass('more less');
        }
        $('.screenshot img').attr('src', '');
        $('.screenshot img').attr('src', '/3ds/homebrew/screenshots/'+id+'.png');
        $('.details table td').each(function(index) {
            if (json[id].comp[index]!==undefined) {
                    $(this).css('background-color', json[id].comp[index]==2 ? "#0c0" : json[id].comp[index]==1 ? "#ffa500" : "#fa8072");
                } else {
                    $(this).css('background-color', 'transparent');
                }
        });
    }

    $('.title').click(function() {
        id = $(this).parent().attr('id');
        showDetails();
    });

    $('.show').click(function() {
        $('.compat').fadeToggle(200);
        if ($(this).hasClass('more')) $('.details .desc').html(json[id].long + ' ');
        else if ($(this).hasClass('less')) $('.details .desc').html(json[id].long.substring(0,240) + '\u2026 ');
        $(this).toggleClass('more less');
    });

    $('#btm_x').click(function() {
        $('.details').fadeOut(500);
    });

    var options = {
        valueNames: ['title', 'desc', 'author', 'tags', 'release', 'cat', 'status'],
        page: 30,
        plugins: [
            ListPagination({paginationClass: "top", innerWindow: 15}),
            ListPagination({paginationClass: "bottom", innerWindow: 15})
        ]
    };

    var hbList = new List('hb_list', options);

    hbList.on('updated', function() {
        $('.list').append('<li class="none" style="display:none"></li>');
        if ((hbList.visibleItems.length % 2 === 0) || (window.innerWidth < 1080)) $('.none').hide();
        $('#qt').html(str_found + hbList.matchingItems.length + ' homebrew(s).<br/>' +
        str_listing + hbList.visibleItems.length + ' homebrew(s).');
        if ((hbList.visibleItems.length % 2 == 1) && (window.innerWidth >= 1080)) $('.none').show();
    });

    $('.filter').change(function() {
        hbList.filter(function(item) {
            if ($('input#' + item.values().cat).prop('checked') && $('input#' + item.values().status).prop('checked') && $('input#' + (item.values().release=="0" ? "unreleased" : (item.values().release.length===0 ? "unkdate" : "released"))).prop('checked')) return true;
            else return false;
        });
    });

    $('#select_p').change(function() {
        var value = parseInt(this.options[this.options.selectedIndex].value);
        if (value==999) $('.pagination').hide();
        else $('.pagination').show();
        hbList.page = value;
        hbList.search($('.search').val());
    });

    $('#stats').click(function() {
        $('.stats').slideToggle();
        $('.stats #st_t').html(json.length);
        $('.stats #st_a').html(stats.app + " (" + (Math.round((stats.app*1000) / json.length) / 10) + "%)");
        $('.stats #st_g').html(stats.game + " (" + (Math.round((stats.game*1000) / json.length) / 10) + "%)");
        $('.stats #st_e').html(stats.emu + " (" + (Math.round((stats.emu*1000) / json.length) / 10) + "%)");
        $('.stats #st_c').html(stats.cfw + " (" + (Math.round((stats.cfw*1000) / json.length) / 10) + "%)");
        $('.stats #st_r').html(stats.rl + " (" + (Math.round((stats.rl*1000) / json.length) / 10) + "%)");
        $('.stats #st_w').html(stats.wip + " (" + (Math.round((stats.wip*1000) / json.length) / 10) + "%)");
        $('.stats #st_f').html(stats.finished + " (" + (Math.round((stats.finished*1000) / json.length) / 10) + "%)");
        $('.stats #st_d').html(stats.discontinued + " (" + (Math.round((stats.discontinued*1000) / json.length) / 10) + "%)");
    });

    $(window).resize(function() {
        hbList.update();
    });

    $('.search').val(queries.search);
    hbList.search(queries.search);
    hbList.sort('title', {order: "asc"});
    if (queries.sort!==undefined) {
        var sort = queries.sort.split('|');
        hbList.sort(sort[0], {
                order: ((sort[1]!==undefined) ? sort[1] : "asc")
            });
    }

    if (queries.filter!==undefined) {
        var bytype, bydevst, byappst;
        var filter = queries.filter.split('|');
        for (i = 0; i < filter.length; i++) {
            $('.filter#'+filter[i]).click();
            switch (filter[i]) {
                case "app":case"game":case"emu":case"cfw": bytype = true; break;
                case "released":case"unreleased":case"unkdate": byappst = true; break;
                case "wip":case"discontinued":case"finished":case"unknown": bydevst = true; break;
            }
        }
        if (bytype) {$('.filter.type').click();}
        if (byappst) {$('.filter.appst').click();}
        if (bydevst) {$('.filter.devst').click();}
    }

    if (queries.show >= 0 && queries.show < json.length) {
        id = queries.show;
        showDetails();
    }
})
.error(function() {
    $('#qt').html(str_failed);
});