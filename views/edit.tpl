<header>
	<button class="fa fa-save" role="saveProduct" data-id="{$product->id_product}"></button>
	<button class="fa fa-plus" role="addDeclination" data-id="{$product->id_product}"></button>
	<header>
	<button class="btn btn-info fa fa-save inv" role="saveDeclination"></button>
	<button class="btn btn-info fa fa-edit needSaving" role="htmlEdit"></button>
	<button class="btn btn-info fa fa-image needSaving" role="pictureManager"></button>
	<button class="btn btn-info fa fa-euro needSaving" role="vouncherManager"></button>
	<button class="btn btn-info fa fa-remove needSaving" role="removeDeclination"></button>
	</header>
</header>
<article>

	<section class="col1">
		<fieldset>
			<label>
				Actif
			</label>
			<div>
				<select class="btn-switch" name="enable">
					<option value="0"{if !$product->is_active()} selected="selected"{/if}>Non</option>
					<option value="1"{if $product->is_active()} selected="selected"{/if}>Oui</option>
				</select>
			</div>
		</fieldset>
		<fieldset>
			<label>
				Rérérence
			</label>
			<div>
				<input type="text" name="product_reference" value="{$product->product_reference}">
			</div>
		</fieldset>
		<fieldset>
			<label>
				Url
			</label>
			<div>
				{foreach $languages as $iso=>$lang}
				<input type="text" name="rewrite_{$iso}" data-lang="{$iso}" value="{if isset($product->contents[$iso])}{$product->contents[$iso].product_rewrite}{/if}" style="display:none">
				{/foreach}
			</div>
		</fieldset>
		<fieldset>
			<label>
				Type
			</label>
			<div>
				<select name="enable">
					<option value="0"{if $product->id_type==0} selected="selected"{/if}>Vêtement</option>
				</select>
			</div>
		</fieldset>
		<fieldset>
			<label>
				Collection
			</label>
			<div>
				{foreach $collections as $col}
				{@_id = Tools::random(4)}
				<input name="collections" id="{$_id}" type="checkbox" value="{$col->id_category}"{if in_array($col->id_category, $associations)} checked="checked"}{/if} data-controller="{$col->contents[$current_lang].controller}"><label  data-controller="{$col->contents[$current_lang].controller}" for="{$_id}">{$col->contents[$current_lang].name}</label>
				{/foreach}
			</div>
		</fieldset>
	</section>
	<section class="col2">
		<div>
			<ul role="declinations_list">
				{foreach $product->declinations as $decl}
				<li 
					data-id="{$decl->id_product_declination}" 
					data-reference="{$decl->reference}"
					data-min-qty="{$decl->minimal_qty}"
					data-qty="{$decl->quantity}"
					data-price="{$decl->price}"
					data-enable="{$decl->is_active()}"
					data-available="{if $decl->quantity >= $decl->minimal_qty}1{else}0{/if}"
					{foreach $languages as $iso=>$lang}
					data-rewrite-{$iso}="{$decl->contents[$iso].rewrite}"
					data-name-{$iso}="{$decl->contents[$iso].name}"
					{/foreach}
					>
				{$decl->contents[$current_lang].name}
				</li>
				{/foreach}
			</ul>
		</div>
	</section>
	<section class="col3">
		<input type="hidden" name="id_product_declination">
		<br>
		<fieldset>
			<label>
				Active
			</label>
			<div>
				<select class="btn-switch" name="declination_enable">
					<option value="0">Non</option>
					<option value="1">Oui</option>
				</select>
			</div>
		</fieldset>
		<fieldset>
			<label>
				Rérérence
			</label>
			<div>
				<input type="text" name="product_declination_reference">
			</div>
		</fieldset>
		<fieldset>
			<label>
				Nom
			</label>
			<div>
				{foreach $languages as $iso=>$lang}
				<input type="text" name="declination_name_{$iso}" data-lang="{$iso}" style="display:none">
				{/foreach}
			</div>
		</fieldset>
		<fieldset>
			<label>
				Url
			</label>
			<div>
				{foreach $languages as $iso=>$lang}
				<input type="text" name="declination_rewrite_{$iso}" data-lang="{$iso}" style="display:none">
				{/foreach}
			</div>
		</fieldset>
		<fieldset>
			<label>
				Quantité minimum
			</label>
			<div>
				<input type="text" name="minimal_qty">
			</div>
		</fieldset>
		<fieldset>
			<label>
				Quantité disponible
			</label>
			<div>
				<input type="text" name="qty">
			</div>
		</fieldset>
	</section>
	<section class="col4">
		<fieldset>
			<label>
				Prix
			</label>
			<div>
				<input type="text" name="price">
			</div>
		</fieldset>
	</section>
</article>