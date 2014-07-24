<div class="clearfix list" node-type="listwrap">
  <% for(var i=0 , len = list.length; i<len; i++) {%>
  	<div class="column" node-type="columns">
		  <div class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all">
			    <div class="portlet-header ui-widget-header ui-corner-all">
			    	<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>
			    	<%= list[i].name%>
			    </div>
			    <div class="portlet-content">
			    	<ul>
				  		<% for(var j=0 , newsList = list[i].list , jLen = newsList.length; j<jLen; j++) {%>
							<li><a href="<%= newsList[j].url%>"><%= newsList[j].title%></a></li>  			
				  		<% } %>	
			    	</ul>
			    </div>
		  </div>
	</div>
  <% } %>
</div>