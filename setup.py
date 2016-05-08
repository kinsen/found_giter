#!/usr/bin/env python
# *_* coding=utf8 *_*

import setuptools

requirements = ["eventlet==0.15.2", "ujson"]

setuptools.setup(
    name="found_giter",
    version="2016.5",
    author="K",
    description="Found Git User",
    scripts=[
        "bin/found-giter"
    ],
    packages=setuptools.find_packages(exclude=['bin', 'tests']),
    install_requires=requirements,
)
