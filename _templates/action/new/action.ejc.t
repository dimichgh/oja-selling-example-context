---
to: src/<%= h.domain(name) %>/<%= h.actionName(name) %>/index.js
---
'use strict';

/**
 * Action: <%=h.actionName(name)%>
 * Domain: <%=h.domain(name)%>
 */
module.exports = context => async parameters => {
    // put your action logic here
    // you can use async/await and return promise or dirrect object
    return `<%=h.domain(name)%>.<%=h.actionName(name)%> is called`;
};