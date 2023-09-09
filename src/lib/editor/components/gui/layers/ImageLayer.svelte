<script>
	/** @type {any} */
	export let imageEntity;

	/** @type {any} */
	export let canvasData;

	$: scale = imageEntity.ratios.width + imageEntity.ratios.height / 2;
	$: en_Width = (imageEntity.size.width / scale) * canvasData.scale;
	$: en_Height = (imageEntity.size.height / scale) * canvasData.scale;
</script>

<div class="flex gap-2 py-2">
	<div class="h-auto m-auto">
		<img class="max-h-16" src={imageEntity.img.src} alt={imageEntity.file_name} />
	</div>
	<div>
		<p class="text-amber-100 overflow-hidden text-ellipsis max-w-[8rem]">{imageEntity.file_name}</p>
		<p class="text-xs italic whitespace-nowrap">
			<span class="not-italic">actual:</span>
			{imageEntity.size.width} x {imageEntity.size.height}
		</p>
		<p class="text-xs italic whitespace-nowrap">
			<span class="not-italic">viewport:</span>
			{Math.floor(en_Width)} x {Math.floor(en_Height)}
		</p>
	</div>
</div>
