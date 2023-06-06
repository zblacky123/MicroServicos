//fazer referência aos controles html do formulário
const btn = document.getElementById("btnLogin");
const txtuser = document.getElementById("txtuser");
const txtpass = document.getElementById("txtpassword");
let autenticado;
let token;


btn.onclick = ()=>{
    //validação dos campos usuario e senha
    if(txtuser.value.trim()=="" || txtpass.value.trim()==""){
        return alert("Nome de usuário ou senha obrigatório");
    }
    else{
        /*
        Vamos usar o comando fetch(buscar) para fazer uma 
        requisão a nossa API e, realizar o login. Passaremos
        o nome de usuário e senha.
        */
       fetch("http://127.0.0.1:30021/users/login",{
            method:"POST",
            headers:{
                "accept":"application/json",
                "content-type":"application/json"
            },
            body:JSON.stringify({
                nomeusuario:txtuser.value,
                senha:txtpass.value
            })
       }).then((response)=>response.json())
       .then((dado)=>{
        if(dado.output=="Authenticated"){
            autenticado = true;
            token = dado.token;
            txtuser.value = "";
            txtpass.value = "";
        }
        else{
            txtuser.value = "";
            txtpass.value = "";
            return alert("Usuário ou Senha incorreto");
        }
       }).catch((error)=>console.error(`Não foi possível requisitar a API -> ${error}`))
    }
}


document.getElementById("registro").onclick = ()=> {
    document.getElementById("shadow").style.zIndex="100";
    document.getElementById("shadow").style.opacity="1";
}

document.getElementById("fechar").onclick = ()=> {
    document.getElementById("shadow").style.zIndex="-100";
    document.getElementById("shadow").style.opacity="0";

}

//Script para cadastrar um novo usuário no banco de dados
const btncad = document.getElementById("btncadastrar");
const txtusuario = document.getElementById("txtusuario");
const txtsenha = document.getElementById("txtsenha");
const txtemail = document.getElementById("txtemail");
const txtfoto = document.getElementById("txtfoto");

btncad.onclick = ()=> {
    if(txtusuario.value.trim()=="" || 
    txtsenha.value.trim()=="" ||
     txtemail.value.trim()==""){
        return alert("Todos os campos devem ser preenchidos")
     }
     else{
        fetch("http://127.0.0.1:30021/users/insert",{
            method:"POST",
            headers:{
                "accept":"application/json",
                "content-type":"application/json"
            },
            body:JSON.stringify({
                nomeusuario:txtusuario.value,
                senha:txtsenha.value,
                email:txtemail.value,
                foto:txtfoto.value
            })
        }).then((response)=>response.json())
        .then((result)=>{
            if(result.output=="Inserted"){
                alert("Usuário cadastrado com sucesso!");
                txtusuario.value = "";
                txtsenha.value = "";
                txtemail.value = "";
                txtfoto.value = "";
                document.getElementById("shadow").style.zIndex="-100";
                document.getElementById("shadow").style.opacity="0";
            }
            else{
                alert("Não foi possível cadastrar. Tente outra vez");
            }
        })
        .catch((error)=>console.error(`Erro ao cadastrar->${error}`))
     }
}