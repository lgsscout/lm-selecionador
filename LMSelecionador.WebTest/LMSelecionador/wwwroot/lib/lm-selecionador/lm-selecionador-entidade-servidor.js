/*!
 * lm-framework beta 3
 */



$(document).ready(function () {

    // Valida dependencias
    if (typeof jQuery === 'undefined') {
        console.warn('lmSelecionadorEntidade: JavaScript precisa do jQuery');
        return;
    }
    if (typeof jqxListBox === 'undefined') {
        console.warn('lmSelecionadorEntidade JavaScript precisa do jqxListBox');
        return;
    }


    //----------------------
    // Forma de Usar
    //----------------------
    //$("#meu-componente-input-text").lmSelecionadorEntidade(
    //    {
    //        url: "@Url.Content("~/TabelaFrete/ConsultarRegiao")",
    //        datafieldid: "ID",
    //        datafieldlabel: "Nome",
    //        filtrominlength: 3,
    //        datafields: [
    //              { datafield: 'Nome', datainput: '#ClientePrincipal_Nome' },
    //              { datafield: 'Idade', datainput: '#ClientePrincipal_Idade', unselectValue: '0' }
    //          ],
    //        columns: [
    //              { text: 'First Name', datafield: 'firstname', width: 30% },
    //              { text: 'Last Name', datafield: 'lastname', width: 30% },
    //          ],
    //        beforeSend: function (parametros) {
    //            // parametros: será enviado ao servidor
    //            // para enviar mais filtros para o servidor add propriedades ao objeto "parametros"
    //            parametros['meuFiltro'] = "1,2,3,4,5,6,7,8,9";
    //            parametros['meuOutroFiltro'] = "01/01/2015";

    //        },
    //        onSelect: function (e) {
    //            // e.item: representa o objeto selecionado findo do servidor
    //            // Para recusar a seleção do item use "return false;"
    //            // e.label: o que aparecerá no campo da tela, pode ser modificado
    //        },
    //        beforePost: function (lista) {
    //            // depois do Post e antes de montar a lista
    //            // a lista pode ser modificada add, removendo ou alterando os itens, a lista será usada para montar o resultado
    //        },
    //        onClear: function () {
    //            //Evento de limpeza da seleção, quando o usuário clica na lixeira
    //            objRegiaoOrigemSelecionada = null;
    //        }
    //    });

    $.fn.lmSelecionadorEntidade = function (fn, options) {

        var namefunction = "lmSelecionadorEntidade";

        var originalElement = this;

        // Verifica se o elemento selecionado existe e é um input
        if (this.length == 0) { throw new Error('lmSelecionadorEntidade: Selector inválido ' + this.selector + ' - Por favor, verifique se o ID ou Classe CSS nome utilizado está correto.') };
        if (!this.is('input')) { throw new Error('lmSelecionadorEntidade: Elemento deve ser um "Input"') };

        // Tratamento para caso for chamado sem passar a função: Asume que está montando
        if (typeof fn === 'object' || fn instanceof Object) {
            options = fn;
            fn = "montar";
        }


        if (!$.lmSelecionadorEntidadescopes)
            $.lmSelecionadorEntidadescopes = {};
        var scope = $.lmSelecionadorEntidadescopes[originalElement.attr("id")];
        if (!scope) {
            scope = {};
            $.lmSelecionadorEntidadescopes[originalElement.attr("id")] = scope;
            scope.originalElement = originalElement;
        }

        switch (('' + fn).toLowerCase()) {
            case "montar":
                mountScope(scope, options);
                break;
            case "clear":
                scope.clear();
                break;
            case "select":
                scope.select(options);
                break;
            case "selecteditem":
                return scope.selectedItem();
                break;
            case "readonly":
                scope.readonly(options);
                break;
            default:
                throw new Error('lmSelecionadorEntidade: ' + originalElement.attr('id') + ' "' + fn + '" não é uma função válida');
        }

        return scope;


        // Monta o Escope do Componentes
        function mountScope(scope, options) {

            var originalElement = scope.originalElement;
            scope.itemSelecionado = null;
            scope.isDirty = false;
            scope.source = {};

            var html = '<div data-seletor-unico-id="{0}"> \
                            <div class="input-group input-group-data-seletor-unico"> \
                                <input type="text" class="form-control txt-label" aria-label="filtro"> \
                                <div class="input-group-btn input-group-btn-btn-data-seletor-unico-search"> \
                                    <button type="button" class="btn btn-primary btn-data-seletor-unico-search ladda-button" aria-label="Procurar" data-style="zoom-in"> \
                                        <span class="ladda-label"><i class="glyphicon glyphicon-search" aria-hidden="true"></i></span> \
                                        <span class="ladda-spinner"></span>\
                                    </button> \
                                </div> \
                            </div> \
                        </div>';


            var html_modal = '<div class="modal fade" id="mymodal">\
                            <div class="modal-dialog">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                                        <h4 class="modal-title">Repom Frete</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <div class="input-group">\
                                            <input type="text" placeholder="Pesquisa" class="form-control filtro" aria-label="filtro">\
                                            <div class="input-group-btn input-group-btn-btn-search">\
                                                <button type="button" class="btn btn-default btn-search" aria-label="Procurar">\
                                                    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>\
                                                </button>\
                                            </div>\
                                        </div>\
                                        <span class="field-validation-error">\
                                            <span class="mensagem"></span>\
                                        </span>\
                                        <hr/>\
                                        <div id="listBox">\
                                        </div>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button type="button" class="btn btn-default btn-canelar" data-dismiss="modal">Cancelar</button>\
                                        <button type="button" class="btn btn-primary btn-ok">Ok</button>\
                                    </div>\
                                </div><!-- /.modal-content -->\
                            </div><!-- /.modal-dialog -->\
                        </div><!-- /.modal -->';

            // Atribui o data-seletor-unico-id para que possa ser referenciado
            html = html.replace("{0}", originalElement.attr("id"))

            // This is the easiest way to have default options.
            var settings = $.extend({
                // These are the defaults.
                datafieldid: "",
                datafields: [],
                modaltitle: "Procurar",
                datafieldlabel: "",
                columns: [],
                utilizamodal: true,
                filtrominlength: -1,
                beforeSend: function () { },
                onSelect: function () { },
                afterSelect: function () { },
                onClear: function () { },
                beforePost: function () { },
                unselectValue: "0",
                url: "",
                readonly: false,
            }, options);

            scope.settings = settings;

            // Valida parametros
            if (settings.url == "") throw originalElement.attr("id") + ": " + namefunction + ": Url não informada";
            if (settings.datafieldid == "") throw originalElement.attr("id") + ": " + namefunction + ": datafieldid não informada";
            if (settings.datafieldlabel == "") throw originalElement.attr("id") + ": " + namefunction + ": datafieldlabel não informada";
            if (settings.columns.length <= 0) throw originalElement.attr("id") + ": " + namefunction + ": columns não informada";
            //if (settings.datafields.length <= 0) throw originalElement.attr("id") + ": " + namefunction + ": datafields não informada";

            // Esconde o componente
            //originalElement.hide();
            //originalElement.css("position", "absolute").css("left", -9999);
            //originalElement.prop("readonly", true);
            originalElement.attr("type", "hidden");
            originalElement.addClass("lm-selecionador-entidade-input-hidden");


            // adiciona o HTML que irá subistituilo
            originalElement.after(html);
            // Monta o comportamento
            var element = $('[data-seletor-unico-id=' + originalElement.attr("id") + ']');
            element.append(html_modal);

            if ($.ladda != null)
                element.find(".btn-data-seletor-unico-search").ladda();
            element.find(".btn-data-seletor-unico-search").click(function () {

                if (scope.settings.readonly) return;

                if (scope.itemSelecionado == null) {
                    // não há um item selecionado
                    pesquisar(element.find('.txt-label').val());


                } else {

                    // há um item selecionado
                    // Deselecionao item(limpa)
                    element.attr('data-value', settings.unselectValue);
                    element.attr('data-label', "");
                    refreshElement();
                    element.find('.txt-label').focus();
                    scope.clear();
                }


            });
            element.find('.txt-label').keydown(function (e) {
                if (e.keyCode == 13) {

                    element.find(".btn-data-seletor-unico-search").click();
                    return false;
                }
            });
            element.focusout(function (e) {
                // Limpa pesquisa caso saia do componente sem selecionar nada
                if ($(this).find(e.relatedTarget).length > 0) return;

                var selectedItem = scope.selectedItem();
                if (selectedItem == null) {
                    $(this).find('.txt-label').val('');
                }

            });


            // Configura o Modal
            var mymodal = element.find(".modal");
            mymodal.find(".modal-title").html(settings.modaltitle);
            mymodal.find('.btn-search').click(function () {

                pesquisar(mymodal.find(".filtro").val());

            });
            mymodal.find('.btn-ok').click(function () {

                selectItemFromGrid();

            });
            mymodal.find('.filtro').keydown(function (e) {
                if (e.keyCode == 13) { // enter

                    pesquisar(mymodal.find(".filtro").val());
                    return false;

                }

                if (e.keyCode == 40) { // down

                    //mymodal.find("#listBox").jqxListBox('focus');
                    mymodal.find("#listBox").jqxGrid('selectrow', 0);
                    mymodal.find("#listBox").jqxGrid('wrapper').focus();
                    return false;

                }


            });
            mymodal.find('.filtro').on('input', function (e) {

                mymodal.find(".field-validation-error").hide();
                mymodal.find('.btn-search').prop("disabled", false);
                if ($(this).val().length < settings.filtrominlength) {
                    mymodal.find(".mensagem").html('Informe pelo menos "' + settings.filtrominlength + '" caracteres');
                    mymodal.find(".field-validation-error").show();
                    mymodal.find('.btn-search').prop("disabled", true);
                }

            }).trigger('input');

            mymodal.on("shown.bs.modal", function () {
                //mymodal.find("#listBox").jqxListBox('refresh');
                //mymodal.find("#listBox").jqxGrid('refresh');
                //mymodal.find('.btn-ok').prop("disabled", true);
                mymodal.find('.filtro').focus();
                mymodal.find('.filtro').select();

            });
            mymodal.on("hidden.bs.modal", function () {
                element.find('.txt-label').focus();
                if (element.find('.txt-label').prop("readonly") == false)
                    element.find('.txt-label').select();

                // Limpa a lista
                scope.source = {};
                mymodal.find("#listBox").jqxGrid('clear');

            });

            //// Create a jqxListBox
            //mymodal.find("#listBox").jqxListBox({ multipleextended: false, selectedIndex: 0, source: [], width: '100%', height: '100%' });
            //mymodal.find("#listBox").on('select', function (event) {
            //    var args = event.args;
            //    var item = mymodal.find("#listBox").jqxListBox('getItem', args.index);
            //    if (item == null) {
            //        mymodal.find('.btn-ok').prop("disabled", true);
            //    } else {
            //        mymodal.find('.btn-ok').prop("disabled", false);
            //    }
            //});

            mymodal.find("#listBox").jqxGrid(
                {
                    source: [],
                    columns: settings.columns,
                    sortable: true,
                    width: '100%',
                    height: '240',
                    handlekeyboardnavigation: function (event) {
                        var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                        if (key == 13) {
                            selectItemFromGrid();
                            return false;
                        }
                    },
                });


            var localizationobj = {};
            localizationobj.emptydatastring = "Nenhum registro encontrado";
            localizationobj.sortascendingstring = "Ordenar Crescente";
            localizationobj.sortdescendingstring = "Ordenar Decrescente";
            localizationobj.sortremovestring = "Remover Ordenação";
            // apply localization.
            mymodal.find("#listBox").jqxGrid('localizestrings', localizationobj);
            mymodal.find("#listBox").bind('rowselect', function (event) {

                var selectedRowIndex = event.args.rowindex;
                scope.itemSelecionado = mymodal.find("#listBox").jqxGrid('getrowdata', selectedRowIndex);

                if (scope.itemSelecionado == null) {
                    mymodal.find('.btn-ok').prop("disabled", true);
                } else {
                    mymodal.find('.btn-ok').prop("disabled", false);
                }

            });
            mymodal.find("#listBox").on("rowdoubleclick", function () {
                selectItemFromGrid();
            });

            element.keydown(function (e) {
                if (e.keyCode == 13) { // enter

                    // se o elemento em foco é o "listBox" e foi disparado um enter seleciona um Item
                    if ($(':focus').attr('id') == 'listBox') {

                        selectItemFromGrid();

                    }


                }

            });

            // Functions Publicas
            scope.clear = function () {


                if (settings.onClear(scope.itemSelecionado) == false) return;

                scope.itemSelecionado = null;

                element.val(settings.unselectValue);
                element.attr('data-value', settings.unselectValue);
                element.attr('data-label', "");

                // Atualiza os dataFields
                $(scope.settings.datafields).each(function () {

                    var datainput = $(this.datainput);
                    if (datainput.length == 0) { throw new Error('lmSelecionadorEntidade.datafields: Selector inválido "' + this.datainput + '"- Por favor, verifique se o ID está correto.') };

                    var unselectValue = "";
                    if (this.hasOwnProperty("unselectValue")) {
                        unselectValue = this.unselectValue;
                    }

                    var valor = unselectValue;
                    datainput.val(valor);

                });


                refreshElement();

            }

            scope.select = function (item) {

                selectItem(item);

            }

            scope.selectedItem = function (item) {

                return scope.itemSelecionado;
            }

            scope.readonly = function (valor) {

                scope.settings.readonly = (valor == true || valor.toString().toLowerCase() == "true");
                refreshElement();
            }

            // Functiond Publicas

            // Functions Privadas
            function loadFromServer(filtro) {

                var parametros = {
                    filtro: filtro
                };


                if (settings.beforeSend(parametros) == false) return; // Se retornar false  não pesquisa

                $.ajax({
                    type: "POST",
                    url: settings.url,
                    dataType: "json",
                    data: parametros,
                    beforeSend: function () {
                        // TODO: criar uma forma de load
                        element.find('.txt-label').prop("disabled", true);
                        if ($.ladda != null)
                            element.find(".btn-data-seletor-unico-search").ladda('start');
                    },
                    success: function (json) {
                        var result = eval(json);

                        if (result == null) {
                            alert("Inconsistencia no processamento");
                            return;
                        }

                        if (result.Sucesso == false) {
                            alert(result.Mensagem);
                            return;
                        }


                        // se não retornou um array transforma em um e coloca o objeto dentro
                        if (!Array.isArray(result.Data)) {
                            var lista = [];
                            lista.push(result.Data);
                            result.Data = lista;
                        }


                        MontarLista(result.Data, filtro);

                    },
                    complete: function () {
                        // TODO: criar uma forma de load
                        element.find('.txt-label').prop("disabled", false);
                        element.find('.txt-label').focus();

                        if ($.ladda != null)
                            element.find(".btn-data-seletor-unico-search").ladda('stop');
                    },
                    error: function () {
                        alert("Inconsistencia no processamento");
                    }
                });



            }

            function MontarLista(data, filtro) {

                // Chama a função passando a lista para que se possa fazer filtros na  lista
                settings.beforePost(data);

                //$(data).each(function () {

                //    scope.source.push(
                //        {
                //            label: this[settings.datafieldid],
                //            value: this[settings.datafieldid],
                //            originalItem: this
                //        });
                //});

                scope.source =
                    {
                        localdata: data,
                        datatype: "json"
                    };

                //mymodal.find("#listBox").jqxListBox({ source: source });
                //mymodal.find("#listBox").jqxListBox('refresh');

                mymodal.find("#listBox").jqxGrid({ source: scope.source });
                mymodal.find("#listBox").jqxGrid('refresh');

                var modalIsOpen = mymodal.hasClass('in');

                mymodal.find("#listBox").jqxGrid('selectrow', 0);

                if (data.length == 1 && modalIsOpen == false && filtro != "") {

                    // Se houver apenas um e o modal não estiver aberto, este será selecionado automaticamente
                    //mymodal.find("#listBox").jqxListBox('selectIndex', 0);
                    mymodal.find("#listBox").jqxGrid('selectrow', 0);
                    selectItemFromGrid();

                } else {


                    if (scope.settings.utilizamodal) {


                        // se houver mais de um item ou nenhuma abre o modal sem pesquisa

                        if (modalIsOpen == false) {

                            mymodal.modal('show');

                        } else {
                            mymodal.find('.filtro').focus();
                            mymodal.find('.filtro').select();
                        }

                    }

                }

            }

            function refreshElement() {

                element.find(".btn-data-seletor-unico-search").find("i").removeClass('glyphicon');
                element.find(".btn-data-seletor-unico-search").find("i").removeClass('glyphicon-search');
                element.find(".btn-data-seletor-unico-search").find("i").removeClass('glyphicon-trash');

                if (scope.itemSelecionado == null) {

                    // não há um item selecionado
                    originalElement.val(settings.unselectValue);
                    element.find('.txt-label').val("");
                    element.find('.txt-label').prop("readonly", false);

                    // coloca o icone de lupa no botão
                    element.find(".btn-data-seletor-unico-search").find("i").addClass('glyphicon glyphicon-search');

                } else {

                    // há um item selecionado

                    originalElement.val(element.attr('data-value'));
                    element.find('.txt-label').val(element.attr('data-label'));
                    element.find('.txt-label').prop("readonly", true);

                    // coloca o icone de lixeira no botão
                    element.find(".btn-data-seletor-unico-search").find("i").addClass('glyphicon glyphicon-trash');

                }

                // Valida o elemento: Se já foi modificado "dirty" válida o item.     
                if (scope.isDirty == true) {
                    // O o objeto estiver dirty

                    if (typeof $.validator != 'undefined' && $.validator != null) {                    
                        if (typeof $(originalElement).valid != 'undefined' && typeof $(originalElement).rules() != 'undefined') {
                            $(originalElement).valid();
                            console.log('$(originalElement).valid();');
                        }
                    }
                }

                // Verifica Readonly
                if (scope.settings.readonly) {
                    element.find(".input-group-btn-btn-data-seletor-unico-search").hide();
                    element.find(".input-group-data-seletor-unico").removeClass("input-group");
                    element.find('.txt-label').prop("readonly", true);
                } else {
                    element.find(".input-group-btn-btn-data-seletor-unico-search").show();
                    element.find(".input-group-data-seletor-unico").addClass("input-group");
                }

            }

            function pesquisar(filtro) {

                mymodal.find(".filtro").val(filtro);
                if (filtro.length < settings.filtrominlength) {
                    MontarLista([]); // Para limpar o
                    return;
                }

                loadFromServer(filtro);
            }

            function selectItemFromGrid() {

                if (scope.itemSelecionado == null) return;

                mymodal.modal('hide');

                var e = {
                    item: scope.itemSelecionado,
                    label: ""
                };

                e.label = scope.itemSelecionado[settings.datafieldlabel];
                if (settings.onSelect(e) == false) {
                    scope.clear();
                    return false
                };

                element.attr('data-value', scope.itemSelecionado[settings.datafieldid]);
                element.attr('data-label', e.label);

                // Atualiza os dataFields
                $(scope.settings.datafields).each(function () {

                    var datainput = $(this.datainput);
                    if (datainput.length == 0) { throw new Error('lmSelecionadorEntidade.datafields: Selector inválido "' + this.datainput + '"- Por favor, verifique se o ID está correto.') };

                    var valor = scope.itemSelecionado[this.datafield];
                    datainput.val(valor);

                });

                scope.isDirty = true; // Assume que já foi modificado
                $(originalElement).change();

                refreshElement();

                // Chama a função
                scope.settings.afterSelect(scope.itemSelecionado);

            }

            function selectItem(item) {
                if (item[settings.datafieldid] == settings.unselectValue) return;

                scope.itemSelecionado = item;
                selectItemFromGrid();
            }
            // <!-- Finctions privadas


            // Verifica estado inicial do componente

            // Verifica se já existe um Item selecionado
            // TODO: Terminar
            if (originalElement.val() != settings.unselectValue) {

                var item = {};

                item[settings.datafieldid] = originalElement.val();

                $(scope.settings.datafields).each(function () {

                    var datainput = $(this.datainput);
                    if (datainput.length == 0) { throw new Error('lmSelecionadorEntidade.datafields: Selector inválido "' + this.datainput + '"- Por favor, verifique se o ID está correto.') };

                    item[this.datafield] = $(this.datainput).val();

                });

                selectItem(item);

                // é falso porque está assumindo o status inicial
                scope.isDirty = false;

            }

            // Atualiza estado do componente
            refreshElement();





        }
    };



});

