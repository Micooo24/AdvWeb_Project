$(document).ready(function() {
    var table = $('.data-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: "/suppliers",
        columns: [
            {data: 'id', name: 'id'},
            {data: 'name', name: 'name'},
            {data: 'email', name: 'email'},
            {data: 'contact_number', name: 'contact_number'},
            {
                data: 'img_path',
                name: 'img_path',
                orderable: false,
                searchable: false,
                render: function(data) {
                    if (data) {
                        return '<img src="/public/storage/images/' + data + '" width="100px" height="100px" alt="">';
                    } else {
                        return 'No Image';
                    }
                }
            },
            {data: 'action', name: 'action', orderable: false, searchable: false},
        ]
    });




    $('#createNewSupplier').click(function () {
        $('#saveBtn').val("create-supplier");
        $('#supplier_id').val('');
        $('#supplierForm').trigger("reset");
        $('#modelHeading').html("Create New Supplier");
        $('#ajaxModel').modal('show');
    });

    $('body').on('click', '.editSupplier', function () {
        var supplier_id = $(this).data('id');
        $.get("/suppliers/" + supplier_id + '/edit', function (data) {
            $('#modelHeading').html("Edit Supplier");
            $('#saveBtn').val("edit-supplier");
            $('#ajaxModel').modal('show');
            $('#supplier_id').val(data.id);
            $('#name').val(data.name);
            $('#email').val(data.email);
            $('#contact_number').val(data.contact_number);
        })
    });

    $('#saveBtn').click(function (e) {
        e.preventDefault();
        $(this).html('Sending..');

        var formData = new FormData($('#supplierForm')[0]);
        $.ajax({
            data: formData,
            url: "/suppliers",
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            type: "POST",
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                $('#supplierForm').trigger("reset");
                $('#ajaxModel').modal('hide');
                table.draw();
            },
            error: function (data) {
                console.log('Error:', data);
                $('#saveBtn').html('Save Changes');
            }
        });
    });

    $('body').on('click', '.deleteSupplier', function () {
        var supplier_id = $(this).data("id");
        if (confirm("Do you want to delete this supplier?")){
            $.ajax({
                type: "DELETE",
                url: "/suppliers/" + supplier_id,
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                success: function (data) {
                    table.draw();
                },
                error: function (data) {
                    console.log('Error:', data);
                }
            });
        }
    });
});
