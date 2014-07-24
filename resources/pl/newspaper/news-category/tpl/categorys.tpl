<ol node-type="listwrap" class="selectable">
  <% for(var i=0 , len = list.length; i<len; i++) {%>
  <li class="ui-widget-content<% if(list[i].selected) {%> ui-selected <%}%>" node-type="category" action-data="category=<%=list[i].category%>&name=<%=list[i].name%>"><%=list[i].name%></li>
  <%}%>
</ol>