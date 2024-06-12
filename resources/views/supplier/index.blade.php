@extends('layouts.master')
@section('content')
<div id="suppliers" class="container">
    <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#supplierModal"  >add<span  class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
<div class="card-body" style="height: 210px;">
     <input type="text" id='supplierSearch' placeholder="--search--">
           </div>
 <div  class="table-responsive">
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

     </tbody>
   </table>
 </div>
</div>
<div class="modal fade" id="supplierModal" role="dialog" style="display:none">
 <div class="modal-dialog modal-lg" >
     <div class="modal-content">
       <div class="modal-header">
         <h4 class="modal-title">Suppliers Management</h4>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
         <div class="modal-body">
           <form id="iform" method="#" action="#" enctype="multipart/form-data">

            <div class="form-group">
                 <label for="name_id" class="control-label">Name</label>
                 <input type="text" class="form-control" id="name_id" name="name"  >
            </div>
            <div class="form-group">
               <label for="email_id" class="control-label">Email</label>
               <input type="text" class="form-control " id="email_id" name="email">
             </div>
             <div class="form-group">
               <label for="contact_id" class="control-label">Contact Number</label>
               <input type="text" class="form-control " id="contact_id" name="contact_number" >
             </div>
             <div class="form-group">
                <label for="image" class="control-label">Image</label>
                <input type="file" class="form-control" id="image" name="uploads[]" multiple />
            </div>

           </form>
         </div>
       <div class="modal-footer">
         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
         <button id="supplierSubmit" type="submit" class="btn btn-primary">Save</button>
         <button id="supplierUpdate" type="submit" class="btn btn-primary">Update</button>
        </div>

     </div>
 </div>
</div>
@endsection
