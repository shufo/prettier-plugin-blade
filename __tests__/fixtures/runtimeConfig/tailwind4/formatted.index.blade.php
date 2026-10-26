<div class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3">
    <span class="flex p-2 text-brand content-auto">brand</span>
    <div class="@container mt-4 block @md:flex">container queries</div>
    <div class="{{ $active ? 'bg-brand text-white' : 'bg-white' }} m-2 flex p-4">echo</div>
    <div class="bg-{{ $color }}-500 m-2 p-4">interpolated</div>
    <div class='@if ($large) text-lg font-bold @else text-sm @endif m-2 flex p-4'>directive block
    </div>
    <div class="{!! $classes !!} unknown-class m-2 p-4">raw echo</div>
    <div :class="{ 'p-4 m-2': open }" class="m-2 p-4"></div>
</div>
{{-- prettier-ignore-start --}}
<div class="p-4 m-2">ignored</div>
{{-- prettier-ignore-end --}}
<script>
    const html = '<div class="p-4 m-2"></div>';
</script>
