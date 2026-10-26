<div class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">
    <span class="content-auto text-brand p-2 flex">brand</span>
    <div class="@md:flex @container mt-4 block">container queries</div>
    <div class="p-4 {{ $active ? 'bg-brand text-white' : 'bg-white' }} m-2 flex">echo</div>
    <div class="p-4 bg-{{ $color }}-500 m-2">interpolated</div>
    <div class='p-4 @if ($large) text-lg font-bold @else text-sm @endif m-2 flex'>directive block</div>
    <div class="p-4 {!! $classes !!} m-2 unknown-class">raw echo</div>
    <div :class="{ 'p-4 m-2': open }" class="p-4 m-2"></div>
</div>
{{-- prettier-ignore-start --}}
<div class="p-4 m-2">ignored</div>
{{-- prettier-ignore-end --}}
<script>
    const html = '<div class="p-4 m-2"></div>';
</script>
