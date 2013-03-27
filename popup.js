get_package_info(function(packages){
    show_packages(packages);
});

var show_packages = function(packages){
    get_choosed_packages(function(choosed_packages){
        $('#package-list').html('');
        for (var i = 0; i < packages.packages.length; i ++) {
            var li_dom = $($('#li-tmpl').html());
            $('input:checkbox', li_dom).attr('value', packages.packages[i].id);
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
        } else {
            delete(choosed_packages[self.attr('value')]);
        }
        update_choosed_packages(choosed_packages);
    });
});
