<div class="clearfix list" node-type="listwrap">
  <% for(var i=0 , len = list.length; i<len; i++) {%>
  	<div class="column" node-type="columns">
		  <% for(var j=0 , jLen = list[i].length; j<jLen; j++) {%>
			  <div class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" node-type="portlet" action-data="category=<%= list[i][j].category%>">
				    <div class="portlet-header ui-widget-header ui-corner-all">
				    	<span class='ui-icon ui-icon-minusthick portlet-toggle' action-type="fold"></span>
				    	<%= list[i][j].name%>
				    </div>
				    <div class="portlet-content" node-type="content">
				    	<ul>
					  		<% for(var k=0 , newsList = list[i][j].list , kLen = newsList.length; k<kLen; k++) {%>
								<li><a href="<%= newsList[k].url%>" target="_blank"><%= newsList[k].title%></a></li>  			
					  		<% } %>	
				    	</ul>
				    </div>
			  </div>
		   <% } %>
	</div>
  <% } %>
</div>