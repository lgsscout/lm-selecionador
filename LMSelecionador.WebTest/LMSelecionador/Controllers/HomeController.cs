using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace LMSelecionador.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        public IActionResult Entidades(string Parametro)
        {
            var rand = new Random();

            var result = new
            {
                Data = new List<dynamic>(),
                Sucesso = true
            };

            for (int i = 0; i < 20; i++)
            {
                var l = rand.Next(5, 10);
                var s = string.Empty;
                for (int j = 0; j < l; j++)
                {
                    s += (char)rand.Next('a', 'z');
                }

                var l2 = rand.Next(1, 10);
                var detalhes = new List<dynamic>();

                for (int k = 0; k < l2; k++)
                {
                    detalhes.Add(new
                    {
                        Descricao = $"Detalhe {k + 1}",
                        Valor = rand.Next(2, 10) * 5
                    });
                }

                result.Data.Add(new { ID = i + 1, Descricao = s, Detalhes = detalhes });
            }

            return Json(result);
        }

        public IActionResult EntidadesErro(string Parametro)
        {
            var rand = new Random();

            var result = new
            {
                Data = new List<dynamic>(),
                Sucesso = false,
                Mensagem = "Falha ao consultar entidades"
            };

            return Json(result);
        }
    }
}
