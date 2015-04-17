"use strict";

module.exports = {
  server: {
    port: process.env.API_PORT || 8080
  },
  auth: {
    tokenSecret: 'moar data science',
    ldap: {
      server: {
        url: process.env.LDAP_URL || 'ldap://turn-dc02.turn.corp:389/?uid?sub',
        searchBase: process.env.LDAP_SEARCH_BASE || 'OU=People,OU=TurnCorp,DC=turn,DC=corp',
        searchFilter: '(uid={{username}})',
        adminDn: process.env.LDAP_ADMIN_DN || 'CN=ldap guest,OU=NonUser,OU=TurnCorp,DC=turn,DC=corp',
        adminPassword: process.env.LDAP_ADMIN_PASSWORD || '1dapgu3st@'
      }
    }
  }
};
