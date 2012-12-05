(function(Browser) {
	Browser.Items = Browser.Items ||{};
	Browser.Items.Collection = Backbone.Collection.extend({
		
		model:Browser.Items.Model,
		base : jda.app.apiLocation + 'api/search?',
		search : {	page:1,
					r_itemswithcollections: 1,
					r_tags:1

				},
	
		url : function()
		{
			console.log(this.search);
			//constructs the search URL
			var url = this.base;
			if( !_.isUndefined(this.search.q) && this.search.q.length > 0) url += '&q=' + this.search.q.toString();
			if( !_.isUndefined(this.search.viewType) ) url += '&view_type=' + this.search.viewType;
			if( !_.isUndefined(this.search.content) ) url += '&content=' + this.search.content;
			if( !_.isUndefined(this.search.exclude_content) ) url += '&exclude_content=' + this.search.exclude_content;
			if( !_.isUndefined(this.search.sort) ) url += '&sort=' + this.search.sort;
			if( !_.isUndefined(this.search.collection) && this.search.collection > 0) url += '&collection=' + this.search.collection;
			if( !_.isUndefined(this.search.page) ) url += '&page=' + this.search.page;
			if( !_.isUndefined(this.search.r_items) ) url += '&r_items=' + this.search.r_items;
			if( !_.isUndefined(this.search.r_tags)) url += '&r_tags=' + this.search.r_tags;
			if( !_.isUndefined(this.search.r_itemswithcollections) ) url += '&r_itemswithcollections=' + this.search.r_itemswithcollections;
			if( !_.isUndefined(this.search.r_collections) ) url += '&r_collections=' + this.search.r_collections;
			if( !_.isUndefined(this.search.times)&&!_.isNull(this.search.times) ){
				if( !_.isUndefined(this.search.times.start) ) url += '&min_date=' + this.search.times.start;
				if( !_.isUndefined(this.search.times.end) ) url += '&max_date=' + this.search.times.end;
			}
			if( !_.isUndefined(this.search.user) && this.search.user>=-1&& this.search.user!=="") url += '&user=' + this.search.user;
			if(jda.app.currentView=='event') url+='&geo_located=1';
			console.log('search url: '+ url);
			return url;
		},
	
		setSearch : function(obj, reset)
		{
			console.log('items.collection.setSearch',this.search,obj);
			if(reset){
				this.search = { r_tags:1,page:1, r_items:1 };
				if(_.isNumber(obj.collection)||_.isNumber(obj.user))this.search.r_itemswithcollections=0;
				else this.search.r_itemswithcollections=1;
				if(_.isNumber(obj.user)) this.search.r_collections=1;
			}
			
			
			
			
			_.extend(this.search,obj);
			
			
			
			console.log(jda.app.currentView);
			if(jda.app.currentView=="event") console.log("Range slider values",$("#range-slider").slider( "option", "values" ));
			
			
			
			
			console.log("final search",this.search);
		},
		
		getSearch : function()
		{
			return this.search;
		},
	
		parse : function(response)
		{
		
			console.log("jda.collection.item", response);
			this.tags=response.tags;
			
			if (this.search.r_collections && response.collections){
				this.collectionsCollection = new Browser.Items.Collection(response.collections);
				this.collectionsCount=response.collections_count;
				
			}else{
				this.collectionsCollection = null;
				this.collectionsCount=0;
			}
			
			
			if(this.search.r_itemswithcollections){
				
				this.count = response.items_and_collections_count;
				return response.items_and_collections;
			}
			else{
		
				this.count = response.items_count;
				this.collectionsCount = response.collections_count;
				return response.items;
			}

		}
		
	
	});
	
	
	Browser.Items.MapCollection = Backbone.Collection.extend({
		
		model:Browser.Items.Model,
		base : sessionStorage.getItem("geoServerUrl"),
		initialize : function(models,options){
			console.log(options);
			_.extend(this,options);
		
		},
		url : function()
		{
		
		
			
			return this.base+'getFeatureInfo&SQL='+this.SQL;
		
		},
	
		parse : function(response)
		{
		
			return response.results.splice(0,Math.max(response.results.length,50));
			
		}
		
	
	});

	Browser.Router = Backbone.Router.extend({ /* ... */ });


})(jda.module("browser"));
