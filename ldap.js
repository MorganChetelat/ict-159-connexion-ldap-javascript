const ldap = require('ldapjs');
const assert = require("assert");


// Créer la connexion
const client = ldap.createClient({
    url: ['ldap://192.168.7.141:389']
});

client.on('error', (err) => {
    console.log(err);
});


// Se connecter un compte admin
client.bind('CN=Administrateur,CN=Users,DC=morgan-domain,DC=local', 'MotDePasseAdmin123456', (err) => {
    assert.ifError(err);
    console.log('Utilisateur authentifié !');
})


// Ajouter un utilisateur
const entry = {
    cn: 'James Anstett',
    sn: 'Anstett',
    objectclass: 'user'
};
client.add('CN=James Anstett,CN=Users,DC=morgan-domain,DC=local', entry, (err) => {
    assert.ifError(err);
    console.log('Utilisateur ajouté !');
});

// Modifier un utilisateur
const change = new ldap.Change({
    operation: 'add',
    modification: {
        description: 'Cette description a été ajouté par programmation ! '
    }
});

client.modify('CN=James Anstett,CN=Users,DC=morgan-domain,DC=local', change, (err) => {
    assert.ifError(err);
    console.log('Utilisateur modifié !');
});

// Supprimer un utilisateur
client.del('CN=James Anstett,CN=Users,DC=morgan-domain,DC=local', (err) => {
    assert.ifError(err);
    console.log('Utilisateur supprimé !');
});


// Faire une recherche
const opts = {
    filter: '(displayName=*John*)',
    scope: 'sub',
    attributes: ['dn', 'sn', 'cn']
};


client.search('CN=Users,DC=morgan-domain,DC=local', opts, (err, res) => {
    assert.ifError(err);

    res.on('searchEntry', (entry) => {
        console.log('Entrée: ' + JSON.stringify(entry.object));
    });
    res.on('error', (err) => {
        console.error('Erreur: ' + err.message);
    });
});
