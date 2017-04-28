(function(){
	var _product_nodeId = 'productAdminproducts';
	var _ctrl = 'products';
	var _module = 'productAdmin';
	var _product_contextmenu = {
		'.customlist li':{
			'edit':{
				class: 'fa fa-pencil',
				text: 'Éditer',
				fn: function(o,e){
					o.click();
				}
			},
			'delete' : {
				class: 'fa fa-remove',
				text: 'Supprimer',
				fn : function(o,e){
					id = o.attr('data-id');
					if (!confirm('Voulez-vous vraiment supprimer ce produit (#'+id+') ? ')) return;
					var callback={
						success: function(){
							Acui.notice('Produit supprimé', 'success');
							Acui(_product_nodeId).refresh();
						}
					};
					Acui.callCore('deleteproduct', {id_product: id, obj:true}, _ctrl, _module, callback );
				}
			}
		}
	};

	// list window
	Acui(_product_nodeId).ready(function(){

		this.contextMenu(_product_contextmenu, true);
		this.setEvents('click',{
			'[role=addProduct]': function(){
				var $li = $('<li>', {'class':'item_line','data-controller': Acui.$controllerSelector.val()});
				Acui(_product_nodeId).get().append($li);
				$li.trigger('click').remove();
			},
			'.item_line': function(){
				var id = $(this).attr('data-id');
				var nodeId = 'productEdit_'+id;
				var data = {
					id_product: id,
					controller: _ctrl,
					auwaController: Acui.$controllerSelector.val(),
					module: _module,
					action: 'edit',
				}
				console.log(data);
				var ready = function(){
					var $liSelected = false;
					Acui(nodeId, '[role=declinations_list]').disableSelection().sortable({
						items: ">li",
		  				forceHelperSize: true,
		  				helper: "clone",
		  				axis: 'y',
						stop: function(){
							var list = {}; // id_product_declination : place
							var index = 1;
							Acui(nodeId, '[role=declinations_list] li').each(function(){
								list[ $(this).attr('data-id') ] = index;
								index++;
							})
							Acui.callCore('setDeclinationPlace',  {list: list, obj:true}, 'products', 'productAdmin', {
								success: function(){
									Acui.notice('Ordre des déclinaisons enregistré', 'success');
								}
							});
						}
					});
					Acui(nodeId).setEvents('click', {
						'[role=saveProduct]': function(){
							$o = $(this);
							var data = {
								id_product : $o.attr('data-id'),
								obj: {}
							};
							Acui(nodeId, 'fieldset select[name], fieldset input[name], fieldset textarea[name]').each(function(){
								data.obj[ $(this).attr('name').replace('product_','') ] = $(this).val();
							});
							Acui.callCore('setProduct', data, 'products', 'productAdmin', {
								success: function(r){
									$o.attr('data-id', r.id_product);
									Acui(nodeId).setTitle('Client '+r.forname+' '+r.lastname+ ' | #'+r.id_product);
									Acui(nodeId, 'select[name=delivery_address]').val(r.delivery_address);
									Acui(_product_nodeId).refresh();
									Acui.notice('Produit enregistré', 'success');
								}
							});
						},
						'[role=declinations_list] li': function(){
							Acui(nodeId, '.needSaving').show();
							Acui(nodeId, '[role=declinations_list] li').removeClass('selected');
							$(this).addClass('selected');
							Acui(nodeId, '[name=product_declination_reference]').val( $(this).attr('data-reference') );
							Acui(nodeId, '[name=id_product_declination]').val( $(this).attr('data-id') );
							Acui(nodeId, '[name=minimal_qty]').val( $(this).attr('data-min-qty') ? parseInt($(this).attr('data-min-qty'))  : 0);
							Acui(nodeId, '[name=qty]').val( $(this).attr('data-qty') ? parseInt($(this).attr('data-qty')) : 0 );
							Acui(nodeId, '[name=price]').val( parseFloat($(this).attr('data-price')).toFixed(2) );
							Acui(nodeId, '[name=declination_enable]').val( parseInt($(this).attr('data-enable')) ).trigger('change');
							for (var iso in auwa.languages){
								Acui(nodeId, '[name=declination_rewrite_'+iso+']').val( $(this).attr('data-rewrite-'+iso) );
								Acui(nodeId, '[name=declination_name_'+iso+']').val( $(this).attr('data-name-'+iso) );
							}
							$liSelected = $(this);
						},
						'[role=addDeclination]': function(){
							$liSelected = false;
							Acui(nodeId, '.needSaving').hide();
							Acui(nodeId, '[role=declinations_list] li').removeClass('selected');
							Acui(nodeId, '[name=id_product_declination]').val( 0 );
							Acui(nodeId, '[name=product_declination_reference]').val( '' );
							Acui(nodeId, '[name=minimal_qty]').val( 1 );
							Acui(nodeId, '[name=qty]').val( 0 );
							Acui(nodeId, '[name=price]').val( '' );
							for (var iso in auwa.languages){
								Acui(nodeId, '[name=declination_rewrite_'+iso+']').val( '' );
								Acui(nodeId, '[name=declination_name_'+iso+']').val( '' );
							}
							Acui(nodeId, '[name=declination_enable]').val( 0 ).trigger('change');
							Acui(_product_nodeId).refresh();
						},
						'[role=saveDeclination]': function(){
							var data = {
								id_product_declination: Acui(nodeId, '[name=id_product_declination]').val(),
								obj: {
									reference : Acui(nodeId, '[name=product_declination_reference]').val(),
									minimal_qty: parseInt(Acui(nodeId, '[name=minimal_qty]').val()),
									quantity: parseInt(Acui(nodeId, '[name=qty]').val()),
									price : parseFloat(Acui(nodeId, '[name=price]').val()),
									enable: parseInt(Acui(nodeId, '[name=declination_enable]').val()),
									id_product: Acui(nodeId, '[role=saveProduct]').attr('data-id'),
								},
								contents:{}
							}
							if (!$liSelected){
								data.obj.place = Acui(nodeId, '[role=declinations_list] li').length + 1;
							}
 							for (var iso in auwa.languages){
								if (!data.contents[iso]) data.contents[iso] = {};
								data.contents[iso].rewrite = Acui(nodeId, '[name=declination_rewrite_'+iso+']').val();
								data.contents[iso].name = Acui(nodeId, '[name=declination_name_'+iso+']').val();
								data.contents[iso].iso_lang = iso;
								data.contents[iso].controller = Acui.$controllerSelector.val();
							}
							Acui.callCore('setDeclination',  data, 'products', 'productAdmin', {
								success:function(r){
									Acui.notice('Déclinaison enregistrée', 'success');
									if ($liSelected){
										$li = $liSelected;
									} else {
										// add a new li
										var $li = $('<li>', {
											'data-id': r.id_product_declination
										}).text(r.contents[Acui.language].name).appendTo( Acui(nodeId,'[role=declinations_list]') );
										//Acui(nodeId,'[role=declinations_list]').append($li);
									}
									$li.attr({
										'data-id': r.id_product_declination,
										'data-reference' : r.reference,
										'data-price': r.price,
										'data-enable': r.enable,
										'data-min-qty': r.minimal_qty,
										'data-min-qty': r.minimal_qty,
										'data-qty': r.quantity,
										'data-available': r.quantity >= r.minimal_qty ? 1 : 0
									});
									for (var iso in auwa.languages){
										$li.attr('data-rewrite-'+iso, r.contents[iso].rewrite);
										$li.attr('data-name-'+iso, r.contents[iso].name);
									}
									$li.trigger('click');
									Acui(_product_nodeId).refresh();
								}
							});
						},
						'[role=removeDeclination]': function(){
							if (! confirm('Supprimer cette déclinaison ?')) return;
							var data = {
								obj: {
									id_product_declination : $liSelected.attr('data-id')
								}
							}
							Acui.callCore('deleteDeclination', data, 'products', 'productAdmin', {
								success: function(r){
									$liSelected.remove();
									$liSelected = false;
									Acui.notice('Déclinaison supprimée', 'success');
									Acui(_product_nodeId).refresh();
									Acui(nodeId,'[role=addDeclination]').trigger('click');
								}
							});
						}
					});

					Acui(nodeId,'[role=declinations_list] li').first().trigger('click');
				}
				Acui.open(nodeId, data, 'productEditor maximized', ready);
			}

		})
	})
})()