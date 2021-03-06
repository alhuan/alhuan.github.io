// TODO: add back RS after RS has been fitted to the new synthetic datasets

starts_checked = [
    "RMI",
    "RBS",
    "BinarySearch",
    "BTree",
    "FAST",
    "PGM",
    "ART",
    "ALEX",
]

readOnly = [
    "RMI",
    "RS",
    "FAST",
    "RBS"
]

for (const indexName of starts_checked) {
    document.getElementById(indexName).checked = true;
}

$(document).ready(function() {
    jQuery('input[type="checkbox"][name="filter"]').on('change', filter_magic);
    $("#dataswitch").on('change', filter_magic);
    $('.tables td:nth-child(7), th:nth-child(7)').hide();
    filter_magic();
});


var filter_magic = function(e) {
    var trs = jQuery(`.tables tbody tr`);
    trs.hide();
    jQuery('input[type="checkbox"][name="filter"]').each(function() {
        if (jQuery(this).is(':checked')) {
            var val = jQuery(this).val();
            trs.each(function() {
                var tr = jQuery(this);
                var td = tr.find('td:nth-child(1)');
                var dataset = tr.find('td:nth-child(7)');
                if (td.text().trim() === val && dataset.text().trim() === $("#dataswitch").val()) {
                    tr.show();
                }
            });
        }
    });
    annotate();
};

function showAllIndexes() {
    jQuery('input[type="checkbox"][name="filter"]').each(function() {
        if (!jQuery(this).is(':checked')) {
            console.log($(this).val());
            $(this).prop('checked', true);
        }
    });
    filter_magic();
}

function showReadOnly() {
    jQuery('input[type="checkbox"][name="filter"]').each(function() {
        var val = jQuery(this).val();
        if (readOnly.includes(val)) {
            $(this).prop('checked', true);
        }
        else {
            $(this).prop('checked', false);
        }
    });
    filter_magic();
}

function showUpdatable() {
    jQuery('input[type="checkbox"][name="filter"]').each(function() {
        var val = jQuery(this).val();
        if (readOnly.includes(val)) {
            $(this).prop('checked', false);
        }
        else {
            $(this).prop('checked', true);
        }
    });
    filter_magic();
}