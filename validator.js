class Validator {
  constructor() {
    this._errors = [];
  }

  get Errors() {
    return this._errors;
  }

  /**
   *
   * @param value
   * @returns {string}
   */
    GetTypeObject(value){
  	if (Array.isArray(value))return 'array';
  	if (typeof(value)==='string')return 'string';
  	if (typeof(value)==='number')return 'number';
  	if (typeof(value)==='boolean')return 'boolean';
  	return 'object';
    }
  	
  /**
   *
   * @param obj1
   * @param obj2
   * @returns {boolean}
   */
	deepEqual(obj1, obj2) {
		if (Validator.prototype.GetTypeObject(obj1) !== 'object' || Validator.prototype.GetTypeObject(obj2) !== 'object') {
			if (!(obj1.items === undefined)){
				for (let i=0; i<obj2.length; i++)
				if(obj1.items.type !== typeof(obj2[i]))return false;
				}
			if (!(obj1.type === undefined)){
				if(obj1.type !== Validator.prototype.GetTypeObject(obj2))return false;
			return true;	
			}

			return false;
		}
		if (obj1 === undefined || obj2 === undefined) {
			return false;
		}
		if (obj1 === null || obj2 === null) {
			return false;
		}
		let obj1Keys = Object.keys(obj1);
		let obj2Keys = Object.keys(obj2);
		if (obj1Keys.length !== obj2Keys.length) {
			return false;
		}
		for (let i = 0; i < obj1Keys.length; i++) {
			if (obj2Keys.includes(obj1Keys[i]) === false) {
				return false;
			}
  		}
  		for (let i = 0; i < obj1Keys.length; i++) {
			if (typeof obj1[obj1Keys[i]] === "object") {
				if(!(Validator.prototype.deepEqual(obj1[obj1Keys[i]], obj2[obj1Keys[i]])))return false;
			}
		}
		return true;
	}
    

  /**
   *
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
    CheckArrays(arr1,arr2){
    	let count = 0; 
    	for (let i = 0; i < arr1.length; i++) {
    		for (let j = 0; j < arr2.length; j++){
    			console.log(arr1[i],arr2[j]);  
    			if(arr1[i]===arr2[j]){
    				console.log('элементы совпали');  
    				count++;
   					break;
				}
    			if(typeof(arr1[i])==='object' && typeof(arr2[j])==='object'){
    				console.log(JSON.stringify(arr1[i]));
    				console.log(JSON.stringify(arr2[j]));
    				console.log(JSON.stringify(arr1[i]) === JSON.stringify(arr2[j]));
    				if(JSON.stringify(arr1[i]) === JSON.stringify(arr2[j])){
    				console.log('Объекты совпали');  
    				count++;
   					break;
    				}
    			}
			}
    	}
    	console.log('Count:', count);
    	if (count===arr1.length)return true;
    	return false;
    }


    CheckArrayUniqueItems(arr1){
    	for (let i = 0; i < arr1.length-1; i++) {
    		for (let j = i+1; j<arr1.length; j++){
    			console.log(arr1[i],arr1[j]);  
    			if(arr1[i]===arr1[j])return false;
    			if(typeof(arr1[i])==='object' && typeof(arr1[j])==='object'){
    				if(JSON.stringify(arr1[i]) === JSON.stringify(arr1[j]))return false;
    			}
    		}
		}
    	return true;
    }



  /**
   *
   * @param schema
   * @param dataToValidate
   * @returns {boolean}
   */
  isValid(schema = {}, dataToValidate) {
	console.log(schema, dataToValidate);
 	const types=['null','undefined','boolean','string','number','object','symbol', 'array'];

	if(types.filter(el=>el===schema.type).length===0 && (schema.anyOf===undefined) && (schema.oneOf===undefined)){
		this._errors.push('Unknown type');
		console.log('Неизвестный тип');
		return false;
	}

	if (dataToValidate===null && schema.nullable===false){
		this._errors.push('Value is null, but nullable false');
		console.log('ноля не может быть');
		return false;
 	}
 	if (dataToValidate===null)return true;


/**********************************************NUMBER****************************************************/
  	if (schema.type==='number'){
  		console.log("Зашёл в намбер");
  		if (!(schema.maximum===undefined) && schema.maximum<dataToValidate){
  			this._errors.push('Value is greater than it can be');
  			console.log("Значение больше чем может быть");
  			return false;

  		}
  		if (!(schema.minimum===undefined) && schema.minimum>dataToValidate){
  			this._errors.push('Value is less than it can be');
  			console.log("Значение меньше чем может быть");
  			return false;
  		}
  		if  (typeof(dataToValidate)!=='number'){
  			this._errors.push('Type is incorrect');
			console.log("Тип не корректен");
  			return false;
  		}		
  		if (!(schema.enum===undefined) && !schema.enum.includes(dataToValidate)){
  			this._errors.push('The enum does not support value');
  			console.log("Значения нету в списке");
  			return false;
  		}

  		console.log("Всё кулл");
  		return true;
  	}
/*************************************************BOOLEAN***************************************************/
	if (schema.type==='boolean'){
		console.log('Зашёл в булл');
		if (typeof(dataToValidate)!=='boolean'){
			console.log('Тип не корректен');
			this._errors.push('Type is incorrect');
			return false;
		}
		console.log("Всё кулл");
		return true;
	}
/***********************************************STRING*******************************************************/
	if (schema.type==='string'){
		console.log('Зашёл в строку');
		if (typeof(dataToValidate)!=='string'){
			console.log('Тип не корректен');
			this._errors.push('Type is incorrect');
			return false;
		}
		if(!(schema.maxLength===undefined) && schema.maxLength<dataToValidate.length){
			console.log('Строка слишком длинная');
			this._errors.push('Too long string');
			return false;
		}
		if(!(schema.minLength===undefined) && schema.minLength>dataToValidate.length){
			console.log('Строка слишком короткая');
			this._errors.push('Too short string');
			return false;
		}		
		if(!(schema.enum===undefined) && !schema.enum.includes(dataToValidate)){
			console.log('Строки нету в списке');
			this._errors.push('The enum does not support value');
			return false;
		}
		if(!(schema.pattern===undefined) && !schema.pattern.test(dataToValidate)){
			console.log("Строка не соответствует регулярному выражению");
			this._errors.push('String does not match pattern');
			return false;
		}
		if(!(schema.format===undefined) && schema.format==='email' && !dataToValidate.includes('@')){
			console.log("email не корректен");
			this._errors.push();
			return false;
		}
		const dataTest=/\d{4}-\d{2}-\d{2}/
		if(!(schema.format===undefined) && schema.format==='date' && !dataTest.test(dataToValidate)){
			console.log('дата не корректна');
			this._errors.push('Format of string is not valid');
			return false;
		}		
		console.log("Всё кулл");
		return true;
  }

/**************************************************OBJECT*******************************************************/
	if (schema.type==='object'){
		console.log('Зашёл в объект');

		if (Validator.prototype.GetTypeObject(dataToValidate)!=='object'){
			console.log('Тип не корректен');
			this._errors.push('Type is incorrect');
			return false;
		}

		if(!(schema.maxProperties===undefined) && schema.maxProperties<Object.keys(dataToValidate).length){
			console.log('Количество свойств больше максимального');
			this._errors.push('Too many properties in object');
			return false;
		}

		if(!(schema.minProperties===undefined) && schema.minProperties>Object.keys(dataToValidate).length){
			console.log('Количество свойств меньше минимального');
			this._errors.push('Too few properties in object');
			return false;
		}

		if(!(schema.required===undefined) && !Validator.prototype.CheckArrays(schema.required,Object.keys(dataToValidate))){
			console.log('Объект не содержит обязательные свойства');
			this._errors.push('Property required, but value is undefined');
			return false;
		}


		if(!(schema.additionalProperties===undefined) && schema.additionalProperties===false && Object.keys(schema.properties).length<Object.keys(dataToValidate).length){
			console.log('Объект содержит лишние свойства');
			this._errors.push('An object cant have additional properties');
			return false;
		}	

		if(!(schema.properties===undefined) && !Validator.prototype.deepEqual(schema.properties,dataToValidate)){
			console.log('Значение свойства не соответствует схеме');
			this._errors.push('Type is incorrect');
			return false;
		}


		

		return true;
	}
/********************************************************ARRAY****************************************************************/
	if (schema.type==='array'){
		console.log('Зашёл в массив');
		if(Validator.prototype.GetTypeObject(dataToValidate)!=='array'){
			console.log('Тип не корректен');
			this._errors.push('Type is incorrect');
			return false;
		}

		if(!(schema.minItems===undefined) && schema.minItems>dataToValidate.length){
			console.log('Количество элементов меньше минимального');
			this._errors.push('Items count less than can be');
			return false;
		}

		if(!(schema.maxItems===undefined) && schema.maxItems<dataToValidate.length){
			console.log('Количество элементов больше масимального');
			this._errors.push('Items count more than can be');
			return false;
		}

		if(!(schema.contains===undefined) && !dataToValidate.includes(schema.contains)){
			console.log('Указанный элемент осутствует в массиве');
			this._errors.push('Must contain a value, but does not');
			return false;
		}

		if(!(schema.items===undefined)){
			let a = new Array();
			a= Array.isArray(schema.items)? schema.items.map(el => el=el.type):Object.values(schema.items);
			console.log(a);
			for (let j=0; j<dataToValidate.length; j++){
				if(!a.includes(typeof(dataToValidate[j]))){
					console.log('Неверный тип элементов');
					this._errors.push('Type is incorrect');
					return false;
				}
			}
		}
		
		if(!(schema.enum===undefined)){
			let a = new Array();
			a= Array.isArray(schema.enum)? schema.enum.map(el => {
				if (Array.isArray(el) && el.length===1){
					el=el[0];
				}
				return el;
			}):Object.values(schema.enum);

			console.log(a);
			let flag = 0;
			for (let i=0; i<dataToValidate.length;i++){
				for(let j=0; j<a.length; j++){
					if (JSON.stringify(dataToValidate[i]) === JSON.stringify(a[j]))flag=1;
				}
				if (flag===0){
					console.log('Элемента нету в списке');
					this._errors.push('The enum does not support one of array elements');
					return false;
				} else flag =0 ;
			}
		}

		if(!(schema.uniqueItems===undefined) && schema.uniqueItems===true && !Validator.prototype.CheckArrayUniqueItems(dataToValidate,dataToValidate)){
			console.log('Элементы массива не уникальны');
			this._errors.push('Elements of array not unique');
			return false;
		}


		return true;
	}
	console.log("Объект не зашёл");
	return false;
  }
}
