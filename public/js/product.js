$(document).ready(function () {
    // Initialize DataTable
    var table = $('#productTable').DataTable({
        ajax: {
            url: "/api/products",
            dataSrc: "products"
        },
        dom: 'Bfrtip',
        buttons: [
            'pdf',
            'excel',
            {
                text: 'Add Product',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    $("#productform").trigger("reset");
                    $('#productModal').modal('show');
                    $('#productUpdate').hide();
                    $('#productSubmit').show();
                    $('#productImages').empty(); // Empty the image container
                }
            }
        ],
        columns: [
            { data: 'id' },
            {
                data: 'img_path',
                render: function (data) {
                    var imgPaths = data.split(',');
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
            {
                data: 'brand',
                render: function (data) {
                    return data ? data.brand_name : 'No Brand';
                }
            },
            {
                data: 'supplier',
                render: function (data) {
                    return data ? data.name : 'No Supplier';
                }
            },
            { data: 'description' },
            { data: 'cost' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <a href='#' class='editBtn' data-id="${data.id}">
                            <i class='fas fa-edit' aria-hidden='true' style='font-size:24px'></i>
                        </a>
                        <a href='#' class='deletebtn' data-id="${data.id}">
                            <i class='fas fa-trash-alt' style='font-size:24px; color:red'></i>
                        </a>`;
                }
            }
        ]
    });

    // Populate brand and supplier options
    function populateSelectOptions(selectId, data) {
        var select = $(selectId);
        select.empty();
        select.append(`<option value="">--Select--</option>`);
        $.each(data, function (index, item) {
            select.append(`<option value="${item.id}">${item.name || item.brand_name}</option>`);
        });
    }

    $.ajax({
        url: "/api/products",
        type: "GET",
        success: function (response) {
            populateSelectOptions('#brand_id', response.brands);
            populateSelectOptions('#supplier_id', response.suppliers);
        },
        error: function (error) {
            console.log('Error fetching brands and suppliers:', error);
        }
    });

    // Form validation function
    function validateForm() {
        var isValid = true;
        var name = $('#name_id').val().trim();
        var brand = $('#brand_id').val();
        var supplier = $('#supplier_id').val();
        var description = $('#description_id').val().trim();
        var cost = $('#cost_id').val().trim();
        var imageFiles = $('#image')[0].files;

        // Clear previous error messages
        $('.error-message').remove();

        if (!name) {
            $('#name_id').after('<span class="error-message text-danger">Name is required.</span>');
            isValid = false;
        }
        if (!brand) {
            $('#brand_id').after('<span class="error-message text-danger">Brand is required.</span>');
            isValid = false;
        }
        if (!supplier) {
            $('#supplier_id').after('<span class="error-message text-danger">Supplier is required.</span>');
            isValid = false;
        }
        if (!description) {
            $('#description_id').after('<span class="error-message text-danger">Description is required.</span>');
            isValid = false;
        }
        if (!cost || isNaN(cost) || cost <= 0) {
            $('#cost_id').after('<span class="error-message text-danger">Valid cost is required.</span>');
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

    // Handle Add Product form submission
    $('#productSubmit').on('click', function (e) {
        e.preventDefault();
        if (validateForm()) {
            var formData = new FormData($('#productform')[0]);

            $.ajax({
                url: "/api/products",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    $('#productModal').modal('hide');
                    table.ajax.reload();
                },
                error: function (error) {
                    console.log('Error:', error);
                }
            });
        }
    });

    // Handle click on the edit button to populate the form
    $('#productTable tbody').on('click', '.editBtn', function () {
        var data = table.row($(this).parents('tr')).data();
        $('#productModal').modal('show');
        $('#productSubmit').hide();
        $('#productUpdate').show();

        // Populate the form with product data
        $('#name_id').val(data.name);
        $('#brand_id').val(data.brand_id);
        $('#supplier_id').val(data.supplier_id);
        $('#description_id').val(data.description);
        $('#cost_id').val(data.cost);

        // Clear previous images
        $('#productImages').empty();

        // Display current images if available
        if (data.img_path) {
            var imgPaths = data.img_path.split(',');
            var imagesHTML = '';
            imgPaths.forEach(function (path) {
                if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                    imagesHTML += `<img src="${path}" width="50" height="60" style="margin-right: 5px;">`;
                }
            });
            $('#productImages').append(imagesHTML); // Append images to the container
        }

        // Handle update
        $('#productUpdate').off('click').on('click', function (e) {
            e.preventDefault();
            if (validateForm()) {
                var updateFormData = new FormData($('#productform')[0]);
                updateFormData.append("_method", "PUT");

                $.ajax({
                    url: `/api/products/${data.id}`,
                    type: "POST", // Using POST with _method=PUT
                    data: updateFormData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        $('#productModal').modal('hide');
                        table.ajax.reload();
                    },
                    error: function (error) {
                        console.log('Error:', error);
                    }
                });
            }
        });
    });

    // Handle click on the delete button to remove a product
    $('#productTable tbody').on('click', '.deletebtn', function () {
        var data = table.row($(this).parents('tr')).data();
        if (confirm('Are you sure you want to delete this product?')) {
            $.ajax({
                url: `/api/products/${data.id}`,
                type: "DELETE",
                success: function (response) {
                    table.ajax.reload();
                },
                error: function (error) {
                    console.log('Error:', error);
                }
            });
        }
    });
});


// $(document).ready(function () {
//     var table = $('#productTable').DataTable({
//         ajax: {
//             url: "/api/products",
//             dataSrc: "products"
//         },
//         dom: 'Bfrtip',
//         buttons: [
//             'pdf',
//             'excel',
//             {
//                 text: 'Add Product',
//                 className: 'btn btn-primary',
//                 action: function (e, dt, node, config) {
//                     $("#productform").trigger("reset");
//                     $('#productModal').modal('show');
//                     $('#productUpdate').hide();
//                     $('#productSubmit').show();
//                     $('#productImages').empty(); // Empty the image container
//                 }
//             }
//         ],
//         columns: [
//             { data: 'id' },
//             {
//                 data: 'img_path',
//                 render: function (data) {
//                     var imgPaths = data ? data.split(',') : [];
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
//             {
//                 data: 'brand',
//                 render: function (data) {
//                     return data ? data.brand_name : 'No Brand';
//                 }
//             },
//             {
//                 data: 'supplier',
//                 render: function (data) {
//                     return data ? data.name : 'No Supplier';
//                 }
//             },
//             { data: 'description' },
//             { data: 'cost' },
//             {
//                 data: null,
//                 render: function (data, type, row) {
//                     return `
//                         <a href='#' class='editBtn' data-id="${data.id}">
//                             <i class='fas fa-edit' aria-hidden='true' style='font-size:24px'></i>
//                         </a>
//                         <a href='#' class='deletebtn' data-id="${data.id}">
//                             <i class='fas fa-trash-alt' style='font-size:24px; color:red'></i>
//                         </a>`;
//                 }
//             }
//         ]
//     });

//     // Fetch and populate brands and suppliers once
//     var populateSelectOptions = function (selectId, data) {
//         var select = $(selectId);
//         select.empty();
//         select.append(`<option value="">--Select--</option>`);
//         $.each(data, function (index, item) {
//             select.append(`<option value="${item.id}">${item.name || item.brand_name}</option>`);
//         });
//     };

//     $.ajax({
//         url: "/api/products",
//         type: "GET",
//         success: function (response) {
//             populateSelectOptions('#brand_id', response.brands);
//             populateSelectOptions('#supplier_id', response.suppliers);
//         },
//         error: function (error) {
//             console.log('Error fetching brands and suppliers:', error);
//         }
//     });

//     // Handle Add Product form submission
//     $('#productSubmit').on('click', function (e) {
//         e.preventDefault();
//         var formData = new FormData($('#productform')[0]);

//         $.ajax({
//             url: "/api/products",
//             type: "POST",
//             data: formData,
//             processData: false,
//             contentType: false,
//             success: function (response) {
//                 $('#productModal').modal('hide');
//                 table.ajax.reload();
//             },
//             error: function (error) {
//                 console.log('Error:', error);
//             }
//         });
//     });

//     // Handle click on the edit button to populate the form
//     $('#productTable tbody').on('click', '.editBtn', function () {
//         var data = table.row($(this).parents('tr')).data();
//         $('#productModal').modal('show');
//         $('#productSubmit').hide();
//         $('#productUpdate').show();

//         // Populate the form with product data
//         $('#name_id').val(data.name);
//         $('#brand_id').val(data.brand_id);
//         $('#supplier_id').val(data.supplier_id);
//         $('#description_id').val(data.description);
//         $('#cost_id').val(data.cost);

//         // Clear previous images
//         $('#productImages').empty();

//         // Display current images if available
//         if (data.img_path) {
//             var imgPaths = data.img_path.split(',');
//             var imagesHTML = '';
//             imgPaths.forEach(function (path) {
//                 if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
//                     imagesHTML += `<img src="${path}" width="50" height="60" style="margin-right: 5px;">`;
//                 }
//             });
//             $('#productImages').append(imagesHTML); // Append images to the container
//         }

//         // Handle update
//         $('#productUpdate').off('click').on('click', function (e) {
//             e.preventDefault();

//             // Create a new FormData object
//             var updateFormData = new FormData($('#productform')[0]);

//             // Append the method override for PUT request
//             updateFormData.append('_method', 'PUT');

//             // Send the AJAX request
//             $.ajax({
//                 url: `/api/products/${data.id}`,
//                 type: "POST", // Using POST with _method=PUT
//                 data: updateFormData,
//                 processData: false,
//                 contentType: false,
//                 success: function (response) {
//                     $('#productModal').modal('hide');
//                     table.ajax.reload();
//                 },
//                 error: function (error) {
//                     console.log('Error:', error);
//                 }
//             });
//         });
//     });

//     // Handle click on the delete button to remove a product
//     $('#productTable tbody').on('click', '.deletebtn', function () {
//         var data = table.row($(this).parents('tr')).data();
//         if (confirm('Are you sure you want to delete this product?')) {
//             $.ajax({
//                 url: `/api/products/${data.id}`,
//                 type: "DELETE",
//                 success: function (response) {
//                     table.ajax.reload();
//                 },
//                 error: function (error) {
//                     console.log('Error:', error);
//                 }
//             });
//         }
//     });
// });




