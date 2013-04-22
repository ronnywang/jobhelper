get_package_info(function(packages){
    show_packages(packages);
});

var show_packages = function(packages){
    get_choosed_packages(function(choosed_packages){
        $('#package-list').html('');
        for (var i = 0; i < packages.packages.length; i ++) {
            var li_dom = $($('#li-tmpl').html());
            $('input:checkbox', li_dom).attr('value', packages.packages[i].id);
	    if (packages.packages[i].notice) {
		$('input:checkbox', li_dom).data('notice', packages.packages[i].notice);
	    }
	    
            if ('undefined' !== typeof(choosed_packages[packages.packages[i].id])) {
                $('input:checkbox', li_dom).prop('checked', true);
            }
            $('.package_name', li_dom).text(packages.packages[i].name);
            $('#package-list').append(li_dom);
        }
        var fetch_at = new Date();
        fetch_at.setTime(packages.fetch_at);
        $('#package-fetch-at').text('' + fetch_at);
    });
}

$('#fetch-package-btn').click(function(){
    update_packages(function(packages){
        show_packages(packages);
    });
});

$('#package-list').on('change', 'li input:checkbox', function(){
    var self = $(this);
    get_choosed_packages(function(choosed_packages){
        if (self.is(':checked')) {
            choosed_packages[self.attr('value')] = true;
	    if (self.data('notice')) {
		// 顯示此資料包提示訊息
		self.parents('li').append($('<div></div>').addClass('alert').addClass('alert-info').text(self.data('notice')));
		var div_dom = self.parents('li').find('div.alert');
		if (div_dom.offset().top + div_dom.height() > $(window).height() + $(window).scrollTop()) {
		    $(window).scrollTop(div_dom.offset().top + div_dom.height() - $(window).height() + 50);
		}
	    }
        } else {
            choosed_packages[self.attr('value')] = false;
	    self.parents('li').find('div.alert').remove();
        }
        update_choosed_packages(choosed_packages);
    });
});

$('.nav-switch').click(function(e){
    e.preventDefault();
    var box = $(this).attr('id').split('-')[1];
    $('.nav-switch').removeClass('active');
    $('#nav-' + box).addClass('active');
    $('.div-nav').hide();
    $('#div-' + box).show();
});

var search_serial = 0;
$('#search-word').keyup(function(e){
    var name = $('#search-word').val();
    $('#search-list').html('');

    if ('' == name) {
	return;
    }

    search_serial ++;
    (function(current_search_serial){
	search_package_by_name(name, function(package_id, package_row){
	    get_package_info(function(package_info){
		if (search_serial != current_search_serial) {
		    return;
		}
		package_info = get_package_info_by_id(package_info, package_id);
		document.getElementById('search-list').innerHTML += '<li>'
		+ htmlspecialchars(package_row[0]).replace(name, '<strong>' + name + '</strong>') + ', '
		+ htmlspecialchars(package_row[1]) + '. ' + htmlspecialchars(package_row[2])
		+ '[<a href="' + htmlspecialchars(package_info.url) + '" target="_blank">' + htmlspecialchars(package_info.name) + '</a>]'
		+ '</li>';
	    });
	}, function(web_name, db_name){
            return db_name.indexOf(web_name) > 0;
        });
    })(search_serial);
});
