// <copyright file="TestApiController.cs" company="Roy Berris">
// Copyright (c) Roy Berris. All rights reserved.
// </copyright>

using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers
{
    [Route("[controller]/[action]")]
    public class TestApiController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetName(string lastName) => Ok($"Roy {lastName}");
    }
}
