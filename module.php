<?php
	class productAdminModuleAdmin extends Auwa\Module{
		public function __construct(){
			$this->name = 'productAdmin';
			$this->author = 'Grégory GAUDIN';
			$this->_path = _SYS_MOD_DIR_.'productAdmin/';
			$this->autoControllerLoad=array('products');
			// end of construtor
			return $this->e;
		}
	}
?>