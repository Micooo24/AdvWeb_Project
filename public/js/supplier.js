$(document).ready(function () {
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
                    // Reset the form
                    $("#iform").trigger("reset");
                    // Remove validation messages
                    $('.error-message').remove();
                    // Show the modal
                    $('#supplierModal').modal('show');
                    // Hide the update button and show the submit button
                    $('#supplierUpdate').hide();
                    $('#supplierSubmit').show();
                    // Remove existing images display
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
                    return "<a href='#' class='editBtn' id='editbtn' data-id=" + data.id + "><i class='fas fa-edit' aria-hidden='true' style='font-size:24px'></i></a><a href='#' class='deletebtn' data-id=" + data.id + "><i class='fas fa-trash-alt' style='font-size:24px; color:red'></a></i>";
                }
            }
        ],
    }); // end datatable

    // Add Supplier Submit
    $("#supplierSubmit").on('click', function (e) {
        e.preventDefault();
        if (validateForm()) {
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

                // Remove existing images
                $('#supplierImages').remove();

                // Append images
                var imagesHTML = '';
                data.img_path.split(',').forEach(function (path) {
                    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                        imagesHTML += `<img src="${path}" width='200px' height='200px'>`;
                    }
                });
                $("#iform").append("<div id='supplierImages'>" + imagesHTML + "</div>");
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    // Update Supplier Submit
    $("#supplierUpdate").on('click', function (e) {
        e.preventDefault();
        if (validateForm()) {
            var id = $('#supplierId').val();
            var data = new FormData($('#iform')[0]);
            data.append("_method", "PUT");

            $.ajax({
                type: "POST",
                url: `http://localhost:8000/api/suppliers/${id}`,
                data: data,
                contentType: false,
                processData: false,
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    $('#supplierModal').modal("hide");
                    $('#itable').DataTable().ajax.reload();
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
        var table = $('#itable').DataTable();
        var id = $(this).data('id');
        var $row = $(this).closest('tr');
        console.log(id);
        bootbox.confirm({
            message: "Do you want to delete this Supplier?",
            buttons: {
                confirm: {
                    label: 'yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'no',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log(result);
                if (result) {
                    $.ajax({
                        type: "DELETE",
                        url: `http://localhost:8000/api/suppliers/${id}`,
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            $row.fadeOut(4000, function () {
                                table.row($row).remove().draw();
                            });
                            bootbox.alert(data.success);
                        },
                        error: function (error) {
                            bootbox.alert(data.error);
                        }
                    });
                }
            }
        });
    });
});

// Validate form function
function validateForm() {
    var isValid = true;
    var name = $('#name_id').val().trim();
    var email = $('#email_id').val().trim();
    var contactNumber = $('#contact_id').val().trim();
    var imageFiles = $('#image')[0].files;

    // Clear previous error messages
    $('.error-message').remove();

    if (!name) {
        $('#name_id').after('<span class="error-message text-danger">Name is required.</span>');
        isValid = false;
    }
    if (!/^[^\d]+$/.test(name)) {
        $('#name_id').after('<span class="error-message text-danger">Name must not contain digits.</span>');
        isValid = false;
    }
    if (!email) {
        $('#email_id').after('<span class="error-message text-danger">Email is required.</span>');
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        $('#email_id').after('<span class="error-message text-danger">Invalid email format.</span>');
        isValid = false;
    }
    if (!contactNumber) {
        $('#contact_id').after('<span class="error-message text-danger">Contact number is required.</span>');
        isValid = false;
    } else if (!/^\d+$/.test(contactNumber)) {
        $('#contact_id').after('<span class="error-message text-danger">Contact number must contain only digits.</span>');
        isValid = false;
    }
    if (imageFiles.length > 0) {
        $.each(imageFiles, function (index, file) {
            var fileType = file['type'];
            var validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
            if ($.inArray(fileType, validImageTypes) < 0) {
                $('#image').after('<span class="error-message text-danger">Invalid image type. Only JPG, JPEG, and PNG are allowed.</span>');
                isValid = false;
                return false; // Breaks the each loop
            }
        });
    }

    return isValid;
}
