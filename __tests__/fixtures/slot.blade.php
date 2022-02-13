@permission('post.edit')
<button class="btn btn-primary" onclick="editPost({{ $id }})">Edit Post</button>
@endpermission
@auth
<button class="btn btn-primary" onclick="editPost({{ $id }})">Edit Post</button>
@endauth
@guest
<button class="btn btn-primary" onclick="editPost({{ $id }})">Edit Post</button>
@endguest
@component('components.elements.button')
  @slot('href')
    /plant/details/{{ $plant->system_name }}
  @endslot
@endcomponent
@component('components.elements.button') 
@slot('href')/plant/details/{{ $plant->system_name }} @endslot 
@endcomponent
