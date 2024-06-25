$(document).ready(function () {
    // Initialize DataTable
    $('#itable').DataTable({
        ajax: {
            url: "/api/suppliers",
            dataSrc: ""
        },
        dom: 'Bfrtip',
        buttons: [
            'pdf',
            'excel',
            {
                text: 'Add Supplier',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    $("#iform").trigger("reset");
                    $('.error-message').remove();
                    $('#supplierModal').modal('show');
                    $('#supplierUpdate').hide();
                    $('#supplierSubmit').show();
                    $('#supplierImages').remove();
                }
            }
        ],
        columns: [
            { data: 'id' },
            {
                data: null,
                render: function (data, type, row) {
                    var imgPaths = data.img_path.split(',');
                    var imagesHTML = '';
                    imgPaths.forEach(function (path) {
                        if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                            imagesHTML += `<img src="${path}" width="50" height="60" style="margin-right: 5px;">`;
                        }
                    });
                    return imagesHTML;
                }
            },
            { data: 'name' },
            { data: 'email' },
            { data: 'contact_number' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <a href='#' class='editBtn' id='editbtn' data-id="${data.id}">
                            <i class='fas fa-edit' aria-hidden='true' style='font-size:24px'></i>
                        </a>
                        <a href='#' class='deletebtn' data-id="${data.id}">
                            <i class='fas fa-trash-alt' style='font-size:24px; color:red'></i>
                        </a>
                    `;
                }
            }
        ],
    });

    $('#iform').validate({
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            contact_number: {
                required: true,
                digits: true
            },
            'uploads[]': {
                required: true,
                extension: "png|jpg|jpeg" // Allow only these extensions
            }
        },
        messages: {
            name: {
                required: "Please enter supplier name"
            },
            email: {
                required: "Please enter email address",
                email: "Please enter a valid email address"
            },
            contact_number: {
                required: "Please enter contact number",
                digits: "Please enter only digits"
            },
            'uploads[]': {
                required: "Please select an image file",
                extension: "Please upload files with jpg, jpeg, png extension only"
            }
        },
        errorPlacement: function(error, element) {
            if (element.is(":radio") || element.is(":checkbox")) {
                error.appendTo(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    // Add Supplier Submit
    $("#supplierSubmit").on('click', function (e) {
        e.preventDefault();
        if ($('#iform').valid()) {
            var data = new FormData($('#iform')[0]);
            $.ajax({
                type: "POST",
                url: "/api/suppliers",
                data: data,
                contentType: false,
                processData: false,
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    $("#supplierModal").modal("hide");
                    var $itable = $('#itable').DataTable();
                    $itable.ajax.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

    // Edit Supplier Button
    $('#itable tbody').on('click', 'a.editBtn', function (e) {
        e.preventDefault();
        $('#supplierImages').remove();
        $('#supplierId').remove();
        $("#iform").trigger("reset");

        var id = $(this).data('id');
        $('<input>').attr({ type: 'hidden', id: 'supplierId', name: 'id', value: id }).appendTo('#iform');
        $('#supplierModal').modal('show');
        $('#supplierSubmit').hide();
        $('#supplierUpdate').show();

        $.ajax({
            type: "GET",
            url: `http://localhost:8000/api/suppliers/${id}`,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType: "json",
            success: function (data) {
                console.log(data);
                $('#name_id').val(data.name);
                $('#email_id').val(data.email);
                $('#contact_id').val(data.contact_number);

                $('#supplierImages').remove();

                var imagesHTML = '';
                data.img_path.split(',').forEach(function (path) {
                    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                        imagesHTML += `<img src="${path}" width="50" height="60" style="margin-right: 5px;">`;
                    }
                });
                $('#iform').append(`<div id="supplierImages">${imagesHTML}</div>`);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    // Update Supplier
    $("#supplierUpdate").on('click', function (e) {
        e.preventDefault();
        if ($('#iform').valid()) {
            var id = $('#supplierId').val();
            var data = new FormData($('#iform')[0]);
            $.ajax({
                type: "POST",
                url: `http://localhost:8000/api/suppliers/${id}?_method=PUT`,
                data: data,
                contentType: false,
                processData: false,
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    $("#supplierModal").modal("hide");
                    var $itable = $('#itable').DataTable();
                    $itable.ajax.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

    // Delete Supplier
    $('#itable tbody').on('click', 'a.deletebtn', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        if (confirm("Are you sure you want to delete this supplier?")) {
            $.ajax({
                type: "DELETE",
                url: `http://localhost:8000/api/suppliers/${id}`,
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    var $itable = $('#itable').DataTable();
                    $itable.ajax.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

    // Import Supplier Button Click
    // $("#import").on("click", function () {
    //     var formData = new FormData($('#importForm')[0]);
    //     $.ajax({
    //         type: "POST",
    //         url: `http://localhost:8000/api/suppliers/import?_method=PUT`,
    //         data: formData,
    //         contentType: false,
    //         processData: false,
    //         headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
    //         dataType: "json",
    //         success: function (data) {
    //             console.log(data);
    //             $("#importModal").modal("hide");
    //             var $itable = $('#itable').DataTable();
    //             $itable.ajax.reload();
    //         },
    //         error: function (error) {
    //             console.log(error);
    //         }
    //     });
    // });

    $("#import").on("click", function () {
        var formData = new FormData($('#importForm')[0]);
        formData.append("_method", "PUT");
        $.ajax({
            type: "POST",
            url: "/api/suppliers/import",
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType: "json",
            success: function (data) {
                console.log(data);
                $("#importModal").modal("hide");
                var $itable = $('#itable').DataTable();
                $itable.ajax.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });



    // Update the file name on selection
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    // Hide/Show update button and reset form on modal close
    $('#supplierModal').on('hidden.bs.modal', function () {
        $('#supplierUpdate').hide();
        $('#supplierSubmit').show();
        $("#iform").trigger("reset");
        $('.error-message').remove();
    });
});

$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

