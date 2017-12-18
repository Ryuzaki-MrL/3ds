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
    window.location = '/3ds/devs/' + $(this).val() + (legacy ? "?legacy=true" : "");
});

var devList;

$.getJSON(legacy ? 'homebrew/hbdb.json' : 'https://3ds.titledb.com/v1/entry?only=name&only=author', function(json) {
    $.each(json, function() {
        $.each(this.author.split(", "), function(i, devuser) {
            var devlogin = devuser.replace(/[^a-zA-Z0-9]+/g, "-");
            if (!$('#'+devlogin).length) {
                $('.list').append(
                    '<li><div id="'+devlogin+'">'+
                    '<span class="icon"><img src="https://avatars.githubusercontent.com/'+devlogin+'"/></span>'+
                    '<span class="vdata user"><b>'+devuser+'</b></span>'+
                    '<span class="vdata desc">Real Name: '+devuser+'</span>'+
                    '<span class="vdata">Github: <a href="https://github.com/'+devlogin+'" target="_blank"><img src="btm_e.png"/></a></span>'+
                    '<span class="hdata loc">Unknown</span>'+
                    '<span class="flag">Location: <abbr title="Unknown"><img src="devs/flags/Unknown.png"/></abbr></span>'
                );
            }
        });
    });

    var id;

    $('.icon img').error(function() {
        if ($(this).attr('src')!='/3ds/devs/pic/nopic.png') {
            $(this).attr('src', '/3ds/devs/pic/nopic.png');
        }
    });

    function showDetails() {
        $('.details, .details *').fadeIn(500);
        $('.details .pic img').attr('src', 'https://avatars.githubusercontent.com/'+id);
        $('.details #title').html(id);
        $('.details #title').css('fontSize', 36 - Math.floor(id.length / 2.5));
        $('#hb').empty();
        $.each(json, function() {
            if (this.author.replace(/ |_/g, "-").search(id)>=0) {
                $('#hb').append('<li><a href="https://ryuzaki-mrl.github.io/3ds/homebrew/?legacy='+legacy+'&show='+$(json).index(this)+'">'+this.name+'</a></li>');
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
        valueNames: ['user', 'desc', 'loc'],
        page: 50,
        plugins: [
            ListPagination({paginationClass: "top", innerWindow: 15}),
            ListPagination({paginationClass: "bottom", innerWindow: 15})
        ]
    };

    devList = new List('dev_list', options);

    devList.on('updated', function() {
        $('.list').append('<li class="none" style="display:none"></li>');
        if ((devList.visibleItems.length % 2 === 0) || (window.innerWidth < 1080)) $('.none').hide();
        $('#qt').html(str_found + devList.matchingItems.length + ' dev(s).<br/>' +
        str_listing + devList.visibleItems.length + ' dev(s).');
        if ((devList.visibleItems.length % 2 == 1) && (window.innerWidth >= 1080)) $('.none').show();
        $('img#loading').hide();
    });

    $('#select_p').change(function() {
        var value = parseInt(this.options[this.options.selectedIndex].value);
        if (value==999) $('.pagination').hide();
        else $('.pagination').show();
        devList.page = value;
        devList.search($('.search').val());
    });

    $(window).resize(function() {
        devList.update();
    });

    $('.search').val(queries.search);
    devList.search(queries.search);
    devList.sort('user', {order: "asc"});
    if (queries.sort!==undefined) {
        var sort = queries.sort.split('|');
        devList.sort(sort[0], {
            order: ((sort[1]!==undefined) ? sort[1] : "asc")
        });
    }

    if (queries.show!==undefined && queries.show!="") {
        id = queries.show;
        showDetails();
    }
})
.error(function() {
    $('#qt').html(str_failed);
    $('img#loading').hide();
});