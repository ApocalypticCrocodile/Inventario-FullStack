from django.test import TestCase

# Create your tests here.

from .models import Categoria, Producto


class CategoriaTest(TestCase):

    def test_crear_categoria(self):

        categoria = Categoria.objects.create(
            nombre="Aseo"
        )

        self.assertEqual(
            categoria.nombre,
            "Aseo"
        )


class ProductoTest(TestCase):

    def test_crear_producto(self):

        categoria = Categoria.objects.create(
            nombre="Aseo"
        )

        producto = Producto.objects.create(
            nombre="Alcohol Gel",
            stock=10,
            categoria=categoria
        )

        self.assertEqual(
            producto.stock,
            10
        )

        
