$(document).ready(function () {
    fetchBrands();

    $("#brandSubmit").on('click', function (e) {
        e.preventDefault();
        console.log('click');
        submitBrandForm();
    });

    $("#brandUpdate").on('click', function (e) {
        e.preventDefault();
        updateBrandForm();
    });

    $('#brandModal').on('show.bs.modal', function(e) {
        $("#dform").trigger("reset");
        $('#brandId').remove();
        const id = $(e.relatedTarget).data('id');
        if (id) {
            $('<input>').attr({type: 'hidden', id:'brandId', name: 'id', value: id}).appendTo('#dform');
            fetchBrand(id);
        }
    });

    $('#ctable tbody').on('click', 'a.deletebtn', function (e) {
        e.preventDefault();
        const id = $(this).data('id');
        deleteBrand(id);
    });
});

function fetchBrands() {
    $.ajax({
        type: "GET",
        url: "/api/brands",
        dataType: 'json',
        success: function (data) {
            console.log(data);
            const tbody = $("#dbody");
            tbody.empty();
            data.forEach(function (value) {
                const img = `<img src="/${value.logo}" width='200px' height='200px'/>`;
                const tr = $("<tr>");
                tr.append($("<td>").text(value.id));
                tr.append($("<td>").html(img));
                tr.append($("<td>").text(value.brand_name));
                tr.append($("<td>").text(value.description));
                tr.append(`<td align='center'><a href='#' data-toggle='modal' data-target='#brandModal' id='editbtn' data-id="${value.id}"><i class='fas fa-edit' aria-hidden='true' style='font-size:24px; color:blue'></i></a></td>`);
                tr.append(`<td><a href='#' class='deletebtn' data-id="${value.id}"><i class='fa fa-trash' style='font-size:24px; color:red'></i></a></td>`);
                tbody.append(tr);
            });
        },
        error: function () {
            console.error('AJAX load did not work');
            alert("Error fetching brands.");
        }
    });
}

function submitBrandForm() {
    const form = $('#dform')[0];
    const formData = new FormData(form);
    // console.log('click');
    $.ajax({
        type: "POST",
        url: "/api/brands",
        data: formData,
        contentType: false,
        processData: false,
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        dataType: "json",
        success: function (data) {
            console.log(data);
            $("#brandModal").modal("hide");
            fetchBrands();
            $('#dform').trigger("reset");
        },
        error: function (error) {
            console.error(error);
            alert("Error creating brand.");
        }
    });
}

function fetchBrand(id) {
    $.ajax({
        type: "GET",
        url: `/api/brands/${id}`,
        success: function(data) {
            $("#brandId").val(data.id);
            $("#brand_name").val(data.brand_name);
            $("#description").val(data.description);
            $("#dform").append(`<img src="${data.logo}" width='200px' height='200px' />`);
        },
        error: function() {
            console.error('AJAX load did not work');
            alert("Error fetching brand details.");
        }
    });
}

function updateBrandForm() {
    const id = $('#brandId').val();
    const form = $('#dform')[0];
    const formData = new FormData(form);
    // formData.append('_method', 'PUT');

    $.ajax({
        type: "POST",
        url: `/api/brands/${id}`,
        data: formData,
        contentType: false,
        processData: false,
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        dataType: "json",
        success: function (data) {
            console.log(data);
            $('#brandModal').modal('hide');
            fetchBrands();
        },
        error: function (error) {
            console.error(error);
            alert("Error updating brand.");
        }
    });
}

function deleteBrand(id) {
    bootbox.confirm({
        message: "Do you want to delete this brand?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: "DELETE",
                    url: `/api/brands/${id}`,
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        fetchBrands();
                        bootbox.alert(data.success);
                    },
                    error: function (error) {
                        console.error(error);
                        alert("Error deleting brand.");
                    }
                });
            }
        }
    });
}
