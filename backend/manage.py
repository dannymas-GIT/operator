#!/usr/bin/env python3
import click

@click.group()
def cli():
    pass

@cli.command()
@click.option('--length', default=32, help='Length of the secret key')
def generate_key(length):
    """Generate a new secret key"""
    from app.utils.security import generate_secret_key
    click.echo(generate_secret_key(length))

if __name__ == '__main__':
    cli() 