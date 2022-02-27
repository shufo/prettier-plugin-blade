<div class="z-50 z-10 justify-center md:text-center container z-20 custom-class text-left">
</div>
@foreach ($items as $item)
    @switch($item->status)
        @case('status')
            // Do something
        @break
    @endswitch
@endforeach
