<?php
namespace Auwa;
/**
 *
 * @author AuroraN <g.gaudin[@]auroran.fr>
 */
Auwa::loadPhp('shop/Product', 'class');
Auwa::loadPhp('shop/ProductCategory', 'class');
class ProductsController extends CoreController{

	function loadJs(){
		$this->addJs('edit');
	}
	function loadCss(){
		$this->addCss();
	}
	function action(){
		$this->setTitle('Produits');
		switch ($this->action) {
			case 'edit':
				$p = Product::getFullProduct( Tools::getValue('id_product'), 'force', Tools::getValue('auwaController') );
				$this->setTitle('Produit '.$p->product_reference );
				$this->setVar(array(
					'product'			=> $p,
					'collections'		=> ProductCategory::getCollection(),
				));
				$this->displayContent('edit');
				break;
			default:
				if( !Product::tableExists()){
					Product::createTable();
				}
				if( !ProductContent::tableExists()){
					ProductContent::createTable();
				}
				if( !ProductDeclination::tableExists()){
					ProductDeclination::createTable();
				}
				if( !ProductDeclinationContent::tableExists()){
					ProductDeclinationContent::createTable();
				}
				$list = Product::getCollection();
				foreach ($list as $key => $p) {
					$list[$key] = Product::getFullProduct( $p->id_product, false, $p->contents[$this->getVar('current_lang')]['controller']);
				}
				$this->setVar(array(
					'list'	=> $list
				));
				$this->displayContent('list');
				break;
		}
	}

	public function query(){
		if ( !isset($this->data['obj']) ){
			return $this->setResponse(false, 'Variable(s) manquantes');
		}
		switch ($this->query) {
			case 'setProduct':
				// save a customer
				$p = new Product($this->data['id_product']);
				$r = $p->setValues( $this->data['obj'] );
				$this->setResponse($r!==false, $r ? $c->toArray() : 'Erreur dans la sauvegarde du produit #'.($c->id_product) );
				break;
			case 'deleteProduct':
				$p = new Product($this->data['id_product']);
				$r = $p->remove();
				$this->setResponse($r!==false, $r ? $r : 'Erreur dans la suppression du produit');
				break;
			case 'setDeclination':
				$d = new ProductDeclination( $this->data['id_product_declination']);
				$d->setValues( $this->data['obj'], false );
				foreach ($this->data['contents'] as $iso => $content) {
					if (!isset( $d->contents[$iso])) {
						$pd = new ProductDeclinationContent();
						$d->contents[$iso] = $pd->toArray();
					}
					foreach ($content as $key => $value) {
						$d->contents[$iso][$key] = $value;
					}
				}
				$r = $d->update(true); //save changes including contents
				$this->setResponse($r!==false, $r ? $d->toArray() : 'Erreur dans la sauvegarde de la déclinaison');
				break;
			case 'deleteDeclination':
				$d = new ProductDeclination( $this->data['obj']['id_product_declination']);
				$r = $d->remove();
				$this->setResponse($r!==false, $r ? true : 'Erreur dans la suppression de la déclinaison');
				break;
			case 'setDeclinationPlace':
				foreach ($this->data['list'] as $id_product_declination => $place) {
					$d = new ProductDeclination( $id_product_declination );
					$d->place = (int)$place;
					$d->update();
				}
				$this->setResponse(true , 'Done');
				break;
		}
	}
}
