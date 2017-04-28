<header>
	<button class="fa fa-plus" role="addProduct"></button>
	&nbsp;&nbsp;&nbsp;&nbsp;
	<button><i class="fa fa-info"></i></button><input type="text" class="search" data-filter="begins" data-filtername="reference" placeholder="Référence">&nbsp;
	<button><i class="fa fa-search"></i></button><input type="text" class="search" data-filter="begins" data-filtername="rewrite" placeholder="Rewrite">&nbsp;

</header>
<article>
	<ul class="customlist adv">
	<?php foreach ($list as $product) {?>
		<li class="item_line" data-available="{if $product->declinationsAvailable>0}1{else}0{/if}" data-id="{$product->id_product}" data-controller="{$product->contents[_CURRENT_LANG_]['controller']}" data-reference="{$product->product_reference}" data-rewrite="{$product->contents[_CURRENT_LANG_]['product_rewrite']}">
			<td >
				<i class="fa fa-file fa-4x"></i>
				<span><b>{$product->product_reference}</b><hr><i>{$product->contents[_CURRENT_LANG_]['product_rewrite']}</i></span>
			</td>
		</li>
	<?php } ?>
</div>
