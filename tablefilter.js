;(function() {
	'use strict';

	function TableFilter( el ) {
		if ( !(this instanceof TableFilter) ){
			return new TableFilter( el );
		} 

		if ( !el || el.tagName !== "TABLE" ) {
			throw new Error( "Element must be a table" );
		}

		this.init( el );
	}

	TableFilter.match = {
		equals: function( needle, haystack ) {
			return ( needle === haystack );
		},
		contains: function( needle, haystack ) {
			return ( haystack.indexOf( needle ) !== -1 );
		},
		array: {
			contains: function( needle, haystack ) {
				return ( needle.indexOf( haystack ) !== -1 );
			}
		}
	};

	var _normalize = function( text ) {
		return text.toLowerCase().replace( / |_/, "" );
	};

	TableFilter.prototype = {
		init: function( el ) {
			this.table = el;
			this.filters = {};
			return this;
		},

		addFilter: function( name, opts, match ) {
			opts = opts || {};
			opts.column = opts.column || false;
			opts.data = opts.data || false;

			this.filters[name] = {
				column: opts.column,
				data: opts.data,
				match: match,
				needle: ""
			};
			return this;
		},

		removeFilter: function( name ) {
			delete this.filters[name];
			return this;
		},

		setFilter: function( name, needle, filter ) {
			filter = ( typeof filter === "undefined" ) ? true : filter;
			if( needle instanceof Array ) {
				for (var i = 0; i < needle.length; i++) {
					needle[i] = _normalize( needle[i] );
				}
			}
			else {
				needle = _normalize( needle );
			}
			this.filters[name].needle = needle;
			if( filter ) {
				this.filterTable();
			}
			return this;
		},

		filterTable: function() {
			for (var i = 0; i < this.table.tBodies.length; i++) {
				for (var j = 0; j < this.table.tBodies[i].rows.length; j++) {
					var show = true;
					var row = this.table.tBodies[i].rows[j];

					for( var k in this.filters ) {
						var filter = this.filters[k];

						if( show && filter.needle !== "" && filter.needle !== [] ) {
							var el = ( filter.column ) ? row.querySelector( filter.column ) : row;
							var haystack = ( filter.data ) ? el.dataset[filter.data] : el.innerHTML;
							haystack = _normalize( haystack );
							show = filter.match( filter.needle, haystack );
						}
					}

					row.style.display = ( show ) ? "table-row" : "none";
				}
			}
			return this;
		}
	};

	if( typeof module !== "undefined" && module.exports ) {
		module.exports = TableFilter;
	} else {
		window.TableFilter = TableFilter;
	}
})();