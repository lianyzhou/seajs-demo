<ol node-type="listwrap" class="selectable">
  <% for(var i=0 , len = list.length; i<len; i++) {%>
  <li class="ui-widget-content<% if(list[i].selected) {%> ui-selected <%}%>" node-type="category_<%=list[i].category%>"><%=list[i].name%></li>
  <%}%>
</ol>