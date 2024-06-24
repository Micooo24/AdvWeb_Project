@extends('layouts.master')

@section('content')
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.3/jquery.validate.min.js"></script>



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
                digits: true // Assuming contact number should contain only digits
            },
            'uploads[]': {
                required: true,
                extension: "jpg|jpeg|png|gif" // Validate file extension for images
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
                extension: "Please upload files with jpg, jpeg, png or gif extension"
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

<style>
    #iform label.error {
        font-size: 0.8em;
        color: #F00;
        font-weight: bold;
        display: block;
        margin-left: 215px;
    }

    #iform input.error,
    #iform select.error {
        background: #FFA9B8;
        border: 1px solid red;
    }
</style>
<div id="suppliers" class="container">
    <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#supplierModal">Add Suppliers <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
    <div class="card-body" style="height: 210px;">
        <input type="text" id="supplierSearch" placeholder="-- Search --">
    </div>
    <div class="table-responsive">
        <table id="itable" class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Supplier ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact Number</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="ibody">
                <!-- Table data will be loaded via DataTables AJAX -->
            </tbody>
        </table>
    </div>
</div>

<!-- Add Supplier Modal -->
<div class="modal fade" id="supplierModal" role="dialog">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Suppliers Management</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="iform" name="iform" method="#" action="#" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label for="name_id" class="control-label">Name</label>
                        <input type="text" class="form-control" id="name_id" name="name">
                    </div>
                    <div class="form-group">
                        <label for="email_id" class="control-label">Email</label>
                        <input type="text" class="form-control" id="email_id" name="email">
                    </div>
                    <div class="form-group">
                        <label for="contact_id" class="control-label">Contact Number</label>
                        <input type="text" class="form-control" id="contact_id" name="contact_number">
                    </div>
                    <div class="form-group">
                        <label for="image" class="control-label">Image</label>
                        <input type="file" class="form-control" id="image" name="uploads[]" multiple />
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="supplierSubmit" type="button" class="btn btn-primary">Save</button>
                <button id="supplierUpdate" type="button" class="btn btn-primary">Update</button>
            </div>
        </div>
    </div>
</div>

<div class="card-body">
    <form action="{{url('suppliers/import')}}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="input-group">
            <input type="file" name="importFile" class="form-control" />
            <button type="submit" class="btn btn-primary">Import</button>
        </div>
    </form>
</div>
@endsection
