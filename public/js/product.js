// $(document).ready(function () {
//     $('#itable').DataTable({
//         ajax: {
//             url: "/api/products",
//             dataSrc: ""
//         },
//         dom: 'Bfrtip',
//         buttons: [
//             'pdf',
//             'excel',
//             {
//                 text: 'Add Product',
//                 className: 'btn btn-primary',
//                 action: function (e, dt, node, config) {
//                     $("#iform").trigger("reset");
//                     $('#productModal').modal('show');
//                     $('#productUpdate').hide();
//                     $('#productImages').remove()
//                 }
//             }
//         ],
//         columns: [
//             { data: 'id' },
//             {
//                 data: null,
//                 render: function (data, type, row) {
//                     var imgPaths = data.img_path.split(',');
//                     var imagesHTML = '';
//                     imgPaths.forEach(function (path) {
//                         if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
//                             imagesHTML += `<img src="${path}" width="50" height="60" style="margin-right: 5px;">`;
//                         }
//                     });
//                     return imagesHTML;
//                 }
//             },
//             { data: 'name' },
//             { data: 'brand_id' },
//             { data: 'supplier_id' },
//             { data: 'description' },
//             { data: 'cost' },
//             {
//                 data: null,
//                 render: function (data, type, row) {
//                     return "<a href='#' class='editBtn' id='editbtn' data-id=" + data.id + "><i class='fas fa-edit' aria-hidden='true' style='font-size:24px'></i></a><a href='#' class='deletebtn' data-id=" + data.id + "><i class='fas fa-trash-alt' style='font-size:24px; color:red'></a></i>";
//                 }
//             }

//         ],
//     }); // end datatable

//     $("#productSubmit").on('click', function (e) {
//         e.preventDefault();
//         var data = $('#iform')[0];
//         console.log(data);
//         let formData = new FormData(data);
//         console.log(formData);
//         for (var pair of formData.entries()) {
//             console.log(pair[0] + ', ' + pair[1]);
//         }
//         $.ajax({
//             type: "POST",
//             url: "/api/products",
//             data: formData,
//             contentType: false,
//             processData: false,
//             headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
//             dataType: "json",
//             success: function (data) {
//                 console.log(data);
//                 $("#productModal").modal("hide");
//                 var $itable = $('#itable').DataTable();
//                 // $itable.row.add(data.results).draw(false);
//                 $itable.ajax.reload()
//             },
//             error: function (error) {
//                 console.log(error);
//             }
//         });
//     });

//     $('#itable tbody').on('click', 'a.editBtn', function (e) {
//         e.preventDefault();
//         $('#product').remove();
//         $('#productId').remove();
//         $("#iform").trigger("reset");

//         var id = $(this).data('id');
//         $('<input>').attr({ type: 'hidden', id: 'productId', name: 'id', value: id }).appendTo('#iform');
//         $('#productModal').modal('show');
//         $('#productSubmit').hide();
//         $('#productUpdate').show();

//         $.ajax({
//             type: "GET",
//             url: `http://localhost:8000/api/products/${id}`,
//             headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
//             dataType: "json",
//             success: function (data) {
//                 console.log(data);
//                 $('#name_id').val(data.name);
//                 $('#brand_id').val(data.brand_id);
//                 $('#supplier_id').val(data.supplier_id);
//                 $('#description_id').val(data.description);
//                 $('#cost_id').val(data.cost);

//                 // Remove existing images
//                 $('#productImages').remove();

//                 // Append images
//                 var imagesHTML = '';
//                 data.img_path.split(',').forEach(function (path) {
//                     if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
//                         imagesHTML += `<img src="${path}" width='200px' height='200px'>`;
//                     }
//                 });
//                 $("#iform").append("<div id='productImages'>" + imagesHTML + "</div>");
//             },
//             error: function (error) {
//                 console.log(error);
//             }
//         });
//     });


//     $("#productUpdate").on('click', function (e) {
//         e.preventDefault();
//         var id = $('#productId').val();
//         console.log(id);
//         var table = $('#itable').DataTable();
//         // var cRow = $("tr td:eq(" + id + ")").closest('tr');
//         var data = $('#iform')[0];
//         let formData = new FormData(data);
//         formData.append("_method", "PUT")
//         // // var formData = $("#cform").serialize();
//         // console.log(formData);
//         // formData.append('_method', 'PUT')
//         // for (var pair of formData.entries()) {
//         //     console.log(pair[0] + ', ' + pair[1]);
//         // }
//         $.ajax({
//             type: "POST",
//             url: `http://localhost:8000/api/products/${id}`,
//             data: formData,
//             contentType: false,
//             processData: false,
//             headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
//             dataType: "json",
//             success: function (data) {
//                 console.log(data);
//                 $('#productModal').modal("hide");

//                 table.ajax.reload()

//             },
//             error: function (error) {
//                 console.log(error);
//             }
//         });
//     });

//     $('#itable tbody').on('click', 'a.deletebtn', function (e) {
//         e.preventDefault();
//         var table = $('#itable').DataTable();
//         var id = $(this).data('id');
//         var $row = $(this).closest('tr');
//         console.log(id);
//         bootbox.confirm({
//             message: "Do you want to delete this Product?",
//             buttons: {
//                 confirm: {
//                     label: 'yes',
//                     className: 'btn-success'
//                 },
//                 cancel: {
//                     label: 'no',
//                     className: 'btn-danger'
//                 }
//             },
//             callback: function (result) {
//                 console.log(result);
//                 if (result)
//                     $.ajax({
//                         type: "DELETE",
//                         url: `http://localhost:8000/api/products/${id}`,
//                         headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
//                         dataType: "json",
//                         success: function (data) {
//                             console.log(data);
//                             $row.fadeOut(4000, function () {
//                                 table.row($row).remove().draw();
//                             });

//                             bootbox.alert(data.success);
//                         },
//                         error: function (error) {
//                             bootbox.alert(data.error);
//                         }
//                     });
//             }
//         });
//     })
// })

