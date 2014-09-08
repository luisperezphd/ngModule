// By Luis Perez 
// From blog post: http://www.simplygoodcode.com/2014/04/angularjs-getting-around-ngapp-limitations-with-ngmodule/

(function() {
  function initNgModules(element) {
      var elements = [element],
          moduleElements = [],
          modules = [],
          names = ['ng:module', 'ng-module', 'x-ng-module', 'data-ng-module', 'ng:modules', 'ng-modules', 'x-ng-modules', 'data-ng-modules'],
          NG_MODULE_CLASS_REGEXP = /\sng[:\-]module[s](:\s*([\w\d_]+);?)?\s/;

      function append(element) {
	      if(!element){ 
		      return;
	      }
	      if(~elements.indexOf(element)){
		      return;
	      }
              elements.push(element);
      }

      function discoverElements(){
	      var i, j, name, elements2;
	      for(i = 0; i < names.length; i++) {
		  name = names[i];
		  append(document.getElementById(name));
		  name = name.replace(':', '\\:');
		  if (element.querySelectorAll) {
		      elements2 = element.querySelectorAll('.' + name);
		      for(j = 0; j < elements2.length; j++) append(elements2[j]);
		      
		      elements2 = element.querySelectorAll('.' + name + '\\:');
		      for(j = 0; j < elements2.length; j++) append(elements2[j]);
		      
		      elements2 = element.querySelectorAll('[' + name + ']');
		      for(j = 0; j < elements2.length; j++) append(elements2[j]);
		  }
	      }
      }

      function findNGModule(element){
	  var attributes = Array.prototype.slice.call(element.attributes), attr, i;
	      for (i = 0; i < attributes.length; i++){
		      attr = attributes[i];
		      if(~names.indexOf(attr.name)){
			      return attr.value;
		      }
	      }

      }
      function processElements(elements){
	      var module, i, element, className, match, ret =[];
              for(i = 0; i < elements.length; i++) {
                   element = elements[i];

                   className = ' ' + element.className + ' ';
                   match = NG_MODULE_CLASS_REGEXP.exec(className);
                  if (match) {
                      moduleElements.push(element);
                      modules.push((match[2] || '').replace(/\s+/g, ','));

                  } else {
                      if(element.attributes) {
                	      if((module = findNGModule(element))){
                		      ret.push([element, module]);
                	      }
                      }
                  }
              }
	      return ret;
      }
     discoverElements();
     bootstrapElements(processElements(elements));
     function bootstrapElements(items){ 
      for(var i = 0; i < items.length; i++) {
          var moduleElement = items[i][0];
          var module = items[i][1].replace(/ /g,'').split(",");
          angular.bootstrap(moduleElement, module);
      }
     }
  }

  angular.element(document).ready(function() {
        initNgModules(document);
  });
})();
