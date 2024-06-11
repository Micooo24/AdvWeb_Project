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
                    $("#iform").trigger("reset");
                    $('#supplierModal').modal('show');
                    $('#supplierUpdate').hide();
                    $('#supplierImages').remove()
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

    $("#supplierSubmit").on('click', function (e) {
        e.preventDefault();
        var data = $('#iform')[0];
        console.log(data);
        let formData = new FormData(data);
        console.log(formData);
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        $.ajax({
            type: "POST",
            url: "/api/suppliers",
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType: "json",
            success: function (data) {
                console.log(data);
                $("#supplierModal").modal("hide");
                var $itable = $('#itable').DataTable();
                // $itable.row.add(data.results).draw(false);
                $itable.ajax.reload()
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

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


    $("#supplierUpdate").on('click', function (e) {
        e.preventDefault();
        var id = $('#supplierId').val();
        console.log(id);
        var table = $('#itable').DataTable();
        // var cRow = $("tr td:eq(" + id + ")").closest('tr');
        var data = $('#iform')[0];
        let formData = new FormData(data);
        formData.append("_method", "PUT")
        // // var formData = $("#cform").serialize();
        // console.log(formData);
        // formData.append('_method', 'PUT')
        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }
        $.ajax({
            type: "POST",
            url: `http://localhost:8000/api/suppliers/${id}`,
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType: "json",
            success: function (data) {
                console.log(data);
                $('#supplierModal').modal("hide");

                table.ajax.reload()

            },
            error: function (error) {
                console.log(error);
            }
        });
    });

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
                if (result)
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
        });
    })
})

