var queries = {};
if (document.location.search.substring(1).length > 0) {
    $.each(document.location.search.substr(1).split('&'), function(a,b) {
        var i = b.split('=');
        if (i.length > 1) queries[i[0].toString()] = i[1].toString();
    });
}

var lang = "";
if (queries.lang!=undefined) {
    lang = queries.lang;
    window.location.replace("http://ryuzaki-mrl.github.io/3ds/homebrew/"+lang);
}

$.getJSON("hbdb.json", function(json) {
    $.each(json, function() {
        $('.list').append (
            '<li class="'+this.type+'">' +
            '<div id="'+$(json).index(this)+'">' +
            '<span class="icon"><img class="i" src="/3ds/homebrew/icons/'+$(json).index(this)+'.png"/></span>' +
            '<span class="title"><b>'+this.title+'</b></span>' +
            '<span class="desc">'+this.desc+'</span>' +
            '<span class="author">Author: '+this.author+'</span>' +
            '<span class="tags">'+this.tags+'</span>' +
            '<span class="release">'+this.date+'</span>' +
            '<span class="cat">'+this.type+'</span>' +
            '<span class="status">'+(this.status.length==0 ? 'unknown' : this.status)+'</span>' +
            '</div></li>'
        );
    });

    var id;

    var monthstr = [ "???",
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    $('.i').error(function() {
        $(this).attr('src', '/3ds/homebrew/icons/noicon.png');
    });

    $('.screenshot').error(function() {
        $(this).attr('src', '/3ds/homebrew/screenshots/noscreen.png');
    });

    $('.screenshot').click(function() {
        $('.hb_entry p, .hb_entry h1, .hb_entry table, .hb_entry span:not(#sshot)').fadeOut(120);
        $('.screenshot').animate({width: $('.screenshot').css('width')=='120px' ? 400 : 120}, 360);
        if ($('.screenshot').css('width')!='120px') $('.hb_entry *' + ($('.show').hasClass('less') ? ':not(.compat)' : '')).fadeIn(500);
    });

    function showDetails() {
        $('.hb_entry, .hb_entry *').fadeIn(500);
        $('.screenshot').css('width', '120px');
        $('.hb_entry .i').attr('src', '/3ds/homebrew/icons/'+id+'.png');
        $('.hb_entry #title').html(json[id].title);
        $('.hb_entry #title').css('fontSize', 36 - Math.floor(json[id].title.length / 2.5));
        $('.hb_entry #author').html(json[id].author);
        var year = json[id].date.substring(0,4);
        var month = monthstr[parseInt(json[id].date.substring(4,6))];
        var day = json[id].date.substring(6,8);
        var date = (json[id].date=="0") ? "Unreleased" : (json[id].date.length==0) ? "Unknown" : (month + " " + day + ", " + year);
        $('.hb_entry #release').html(date);
        $('.hb_entry #version').html(date!="Unreleased" ? (json[id].ver.length > 0 ? json[id].ver : "Unknown") : '-');
        $('.hb_entry #site').html(json[id].site.length > 0 ? ('<a href="'+json[id].site+'" target="_blank">'+'<img src="btm_e.png"/>'+'</a>') : '-');
        if (json[id].long.length > 256) {
            $('.hb_entry #desc').html(json[id].long.substring(0,240) + '... ');
            $('.show').addClass('more');
            $('.show').removeClass('less');
            $('.show').show();
        } else {
            $('.hb_entry #desc').html(json[id].long.length > 0 ? json[id].long : json[id].desc);
            $('.show').hide();
            $('.show').removeClass('more less');
        }
        $('.hb_entry .screenshot').attr('src', '');
        $('.hb_entry .screenshot').attr('src', '/3ds/homebrew/screenshots/'+id+'.png');
        $('.hb_entry table td').each(function(index) {
            if (json[id].comp[index]!=undefined) $(this).css('background-color', json[id].comp[index]==2 ? "#00cc00" : json[id].comp[index]==1 ? "#ffa500" : "#fa8072")
            else $(this).css('background-color', 'transparent');
        });
    };

    $('.title').click(function() {
        id = $(this).parent().attr('id');
        showDetails();
    });

    $('.show').click(function() {
        $('.compat').fadeToggle(200);
        if ($(this).hasClass('more')) $('.hb_entry #desc').html(json[id].long + ' ')
        else if ($(this).hasClass('less')) $('.hb_entry #desc').html(json[id].long.substring(0,240) + '... ');
        $(this).toggleClass('more less');
    });

    $('#btm_x').click(function() {
        $('.hb_entry').fadeOut(500);
    });

    var options = {
        valueNames: [ 'title', 'desc', 'author', 'tags', 'release', 'cat', 'status' ],
        page: 30,
        plugins: [
            ListPagination({paginationClass: "top", innerWindow: 13}),
            ListPagination({paginationClass: "bottom", innerWindow: 13})
        ]
    };

    var hbList = new List('hb_list', options);

    hbList.on('updated', function() {
        $('.list').append('<li class="none" style="display:none; visibility:hidden;"></li>');
        if ((hbList.visibleItems.length % 2 == 0) || (window.innerWidth < 1080)) $('.none').hide();
        $('#qt').html('Found ' + hbList.matchingItems.length + ' homebrew(s).<br/>' +
        'Listing ' + hbList.visibleItems.length + ' homebrew(s).');
        if ((hbList.visibleItems.length % 2 == 1) && (window.innerWidth >= 1080)) $('.none').show();
    });

    $('.filter').change(function() {
        hbList.filter(function(item) {
            if ($('input#' + item.values().cat).prop('checked') && $('input#' + item.values().status).prop('checked') && $('input#' + (item.values().release=="0" ? "unreleased" : (item.values().release.length==0 ? "unkdate" : "released"))).prop('checked')) return true
            else return false;
        });
    });

    $('#select_l').change(function() {
        window.location.replace("http://ryuzaki-mrl.github.io/3ds/homebrew/"+this.options[this.options.selectedIndex].value);
    });

    $('#select_p').change(function() {
        hbList.page = parseInt(this.options[this.options.selectedIndex].value);
        hbList.search($('.search').val());
    });

    $(window).resize(function() {
        hbList.update();
    });

    $('.search').val(queries.search);
    hbList.search(queries.search);
    hbList.sort('title', {order: "asc"});
    if (queries.sort!=undefined) hbList.sort(queries.sort, {order: "asc"});

    if (queries.filter!=undefined) {
        var bytype, bydevst, byappst;
        var filter = queries.filter.split('|');
        for (i = 0; i < filter.length; i++) {
            $('.filter#'+filter[i]).click();
            switch (filter[i]) {
                case"app":case"game":case"emu":case"cfw": bytype = true; break;
                case"released":case"unreleased":case"unkdate": byappst = true; break;
                case"wip":case"discontinued":case"finished":case"unknown": bydevst = true; break;
            }
        } if (bytype) $('.filter.type').click();
        if (byappst) $('.filter.appst').click();
        if (bydevst) $('.filter.devst').click();
    }

    if (queries.show >= 0 && queries.show < json.length) {
        id = queries.show;
        showDetails();
    }
})
.error(function() {
    $('#qt').html("Unable to load homebrew database.");
});