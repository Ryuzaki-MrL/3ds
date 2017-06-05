var queries = {};
if (document.location.search.substring(1).length > 0) {
    $.each(document.location.search.substr(1).split('&'), function(a,b) {
        var i = b.split('=');
        if (i.length > 1) {
            queries[i[0].toString()] = i[1].toString();
        }
    });
}

var legacy = queries.legacy==='true';
if (legacy) $("#f-legacy").show();
else $("#f-titledb").show();

$('#select_l').append(
    '<option value="">English</option>' +
    '<option value="pt_br">Português</option>' +
    '<option value="zh_cn">简体中文</option>' +
    '<option value="fr_fr">Français</option>' +
    '<option value="it_it">Italiano</option>' +
    '<option value="de_de">Deutsch</option>'
);
$("#select_l").prop('selectedIndex', language);
$('#select_l').change(function() {
    window.location = '/3ds/homebrew/' + $(this).val() + (legacy ? "?legacy=true" : "");
});

$.getJSON(legacy ? 'homebrew/hbdb.json' : 'https://3ds.titledb.com/v1/entry?nested=true', function(json) {
    var stats = {
        Utility: 0, Game: 0, Emulator: 0, CFW: 0,
        Demo: 0, Installer: 0, rl: 0, wip: 0,
        finished: 0, discontinued: 0
    }, icon;

    $.each(json, function() {
        stats[this.category]++;
        if (legacy) {
            stats[this.status]++;
            stats.rl += (this.date != "0");
            icon = '/3ds/homebrew/icons/'+$(json).index(this)+'.png';
        } else {
            stats.rl++;
            icon = 'https://3ds.titledb.com/v1/'+(this.cia.length!=0 ? 'cia' : 'smdh')+'/'+(this.cia.length!=0 ? this.cia[0].id : (this.tdsx.length!=0&&this.tdsx[0].smdh!=null ? this.tdsx[0].smdh.id : "undefined"))+'/icon_l.png';
        }
        $('.list').append(
            '<li class="'+this.category+'">' +
            '<div id="'+$(json).index(this)+'">' +
            '<span class="icon"><img src="'+icon+'"/></span>' +
            '<span class="vdata title"><b>'+this.name+'</b></span>' +
            '<span class="vdata desc">'+this.headline+'</span>' +
            '<span class="vdata author">Author: '+this.author+'</span>' +
            '<span class="hdata tags">'+this.tags+'</span>' +
            '<span class="hdata release">'+(legacy ? this.date : "")+'</span>' +
            '<span class="hdata cat">'+this.category+'</span>' +
            '<span class="hdata ext">'+(legacy ? (((this.comp[0]>0||this.comp[6]>0) ? "3dsx " : "") + ((this.comp[1]>0||this.comp[7]>0) ? "cia " : "") + ((this.comp[2]>0||this.comp[4]>0||this.comp[5]>0||this.comp[8]>0||this.comp[10]>0||this.comp[11]>0) ? "other " : "") + ((this.comp[3]>0||this.comp[9]>0) ? "arm9" : "")) : ((this.cia.length!=0 ? "cia " : "") + (this.tdsx.length!=0 ? "3dsx " : "") + (this.arm9.length!=0 ? "arm9" : "")))+'</span>' +
            '<span class="hdata status">'+(legacy&&this.status.length!=0 ? this.status : 'unknown')+'</span>' +
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
        $('.screenshot img').animate({width: $('.screenshot img').css('width') == '120px' ? 400 : 120}, 360);
        if ($('.screenshot img').css('width') != '120px') {
            $('.details *' + ($('.show').hasClass('less') ? ':not(.compat)' : '')).fadeIn(500);
        }
    });

    function showDetails() {
        $('.details, .details *').fadeIn(500);
        $('.screenshot img').css('width', '120px');
        var icon = legacy ? '/3ds/homebrew/icons/'+id+'.png' : 'https://3ds.titledb.com/v1/'+(json[id].cia.length!=0 ? 'cia' : 'smdh')+'/'+(json[id].cia.length!=0 ? json[id].cia[0].id : (json[id].tdsx.length!=0&&json[id].tdsx[0].smdh!=null ? json[id].tdsx[0].smdh.id : "undefined"))+'/icon_l.png';
        $('.details .icon img').attr('src', icon);
        $('.details #title').html(json[id].name);
        $('.details #title').css('fontSize', 36 - Math.floor(json[id].name.length / 2.5));
        $('.details #author').html(json[id].author);
        if (legacy) {
            var year = json[id].date.substring(0,4);
            var month = monthstr[parseInt(json[id].date.substring(4,6))];
            var day = json[id].date.substring(6,8);
        } else {
            var year = (json[id].cia.length!=0&&json[id].cia[0].mtime!=null ? json[id].cia[0].mtime.substring(0,4) : (json[id].tdsx.length!=0&&json[id].tdsx[0].mtime!=null ? json[id].tdsx[0].mtime.substring(0,4) : (json[id].arm9.length!=0&&json[id].arm9[0].mtime!=null ? json[id].arm9[0].mtime.substring(0,4) : "0")));
            var month = monthstr[parseInt((json[id].cia.length!=0&&json[id].cia[0].mtime!=null ? json[id].cia[0].mtime.substring(5,7) : (json[id].tdsx.length!=0&&json[id].tdsx[0].mtime!=null ? json[id].tdsx[0].mtime.substring(5,7) : (json[id].arm9.length!=0&&json[id].arm9[0].mtime!=null ? json[id].arm9[0].mtime.substring(5,7) : "0"))))];
            var day = (json[id].cia.length!=0&&json[id].cia[0].mtime!=null ? json[id].cia[0].mtime.substring(8,10) : (json[id].tdsx.length!=0&&json[id].tdsx[0].mtime!=null ? json[id].tdsx[0].mtime.substring(8,10) : (json[id].arm9.length!=0&&json[id].arm9[0].mtime!=null ? json[id].arm9[0].mtime.substring(8,10) : "0")));
        }
        var date = (legacy&&json[id].date=="0") ? str_unreleased : (legacy&&json[id].date.length===0) ? str_unknown : getDate(day, month, year);
        $('.details #release').html(date);
        if (legacy) $('.details #devst').html(getDevStatus(json[id].status, json[id].date!="0"));
        $('.details #version').html(date!=str_unreleased ? (legacy ? (json[id].version.length!==0 ? json[id].version : str_unknown) : (json[id].cia.length!=0&&json[id].cia[json[id].cia.length - 1].version!=null ? json[id].cia[json[id].cia.length - 1].version : str_unknown)) : '-');
        $('.details #site').html(json[id].url!=null&&json[id].url.length!=0 ? ('<a href="'+json[id].url+'" target="_blank">'+'<img src="/3ds/homebrew/btm_e.png"/>'+'</a>') : '-');
        $('.details .desc').css('font-size', json[id].description!=null&&json[id].description.length>550 ? '11pt' : '12.5pt');
        if (json[id].description!=null && json[id].description.length > 256) {
            $('.details .desc').html(json[id].description.substring(0,240) + '\u2026 ');
            $('.show').addClass('more');
            $('.show').removeClass('less');
            $('.show').show();
        } else {
            $('.details .desc').html(json[id].description!=null&&json[id].description.length!=0 ? json[id].description : json[id].headline);
            $('.show').hide();
            $('.show').removeClass('more less');
        }
        $('.screenshot img').attr('src', '');
        if (legacy) $('.screenshot img').attr('src', '/3ds/homebrew/screenshots/'+id+'.png');
        $('.details table td').each(function(index) {
            if (legacy) {
                if (json[id].comp[index]!==undefined) {
                    $(this).css('background-color', json[id].comp[index]==2 ? "#0c0" : json[id].comp[index]==1 ? "#ffa500" : "#fa8072");
                } else {
                    $(this).css('background-color', 'transparent');
                }
            } else {
                var comp = ['tdsx', 'cia', 'gw', 'arm9', 'mset', 'b9s'];
                $(this).css('background-color', json[id][comp[index%6]]!==undefined&&json[id][comp[index%6]].length!=0 ? "#0c0" : "#fa8072");
            }
        });
    }

    $('.list li').click(function() {
        id = $(this).children("div").attr('id');
        showDetails();
    });

    $('.show').click(function() {
        $('.compat').fadeToggle(200);
        if ($(this).hasClass('more')) $('.details .desc').html(json[id].description + ' ');
        else if ($(this).hasClass('less')) $('.details .desc').html(json[id].description.substring(0,240) + '\u2026 ');
        $(this).toggleClass('more less');
    });

    $('#btm_x').click(function() {
        $('.details').fadeOut(500);
    });

    var options = {
        valueNames: ['title', 'desc', 'author', 'tags', 'release', 'cat', 'ext', 'status'],
        page: 50,
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
        $('img#loading').hide();
    });

    $('.filter').change(function() {
        hbList.filter(function(item) {
            return (
                ($('input#' + item.values().cat).prop('checked')) &&
                ($('input#' + item.values().status).prop('checked')) &&
                ($('input#' + (item.values().release=="0" ? "unreleased" : (item.values().release.length===0 ? "unkdate" : "released"))).prop('checked')) && (
                    (item.values().ext.search('3dsx')>-1 && $('input#3dsx').prop('checked')) ||
                    (item.values().ext.search('cia')>-1 && $('input#cia').prop('checked')) ||
                    (item.values().ext.search('arm9')>-1 && $('input#arm9').prop('checked')) || (
                        (item.values().ext.search('other')>-1 || item.values().ext.length===0) &&
                        ($('input#misc').prop('checked'))
                    )
                )
            );
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
        $('.stats #st_a').html(stats.Utility + " (" + (Math.round((stats.Utility*1000) / json.length) / 10) + "%)");
        $('.stats #st_g').html(stats.Game + " (" + (Math.round((stats.Game*1000) / json.length) / 10) + "%)");
        $('.stats #st_e').html(stats.Emulator + " (" + (Math.round((stats.Emulator*1000) / json.length) / 10) + "%)");
        $('.stats #st_c').html(stats.CFW + " (" + (Math.round((stats.CFW*1000) / json.length) / 10) + "%)");
        $('.stats #st_d').html(stats.Demo + " (" + (Math.round((stats.Demo*1000) / json.length) / 10) + "%)");
        $('.stats #st_r').html(stats.rl + " (" + (Math.round((stats.rl*1000) / json.length) / 10) + "%)");
        $('.stats #st_w').html(stats.wip + " (" + (Math.round((stats.wip*1000) / json.length) / 10) + "%)");
        $('.stats #st_f').html(stats.finished + " (" + (Math.round((stats.finished*1000) / json.length) / 10) + "%)");
        $('.stats #st_x').html(stats.discontinued + " (" + (Math.round((stats.discontinued*1000) / json.length) / 10) + "%)");
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
        var bytype, bydevst, byappst, byformat;
        var filter = queries.filter.split('|');
        for (i = 0; i < filter.length; i++) {
            $('.filter#'+filter[i]).click();
            switch (filter[i]) {
                case "Utility":case"Game":case"Emulator":case"CFW":case"Demo":case"Installer": bytype = true; break;
                case "released":case"unreleased":case"unkdate": byappst = true; break;
                case "3dsx":case"cia":case"arm9":case"misc": byformat = true; break;
                case "wip":case"discontinued":case"finished":case"unknown": bydevst = true; break;
            }
        }
        if (bytype) {$('.filter.type').click();}
        if (byappst) {$('.filter.appst').click();}
        if (byformat) {$('.filter.format').click();}
        if (bydevst) {$('.filter.devst').click();}
    }

    if (queries.show >= 0 && queries.show < json.length) {
        id = queries.show;
        showDetails();
    }
})
.error(function() {
    $('#qt').html(str_failed);
    $('img#loading').hide();
});