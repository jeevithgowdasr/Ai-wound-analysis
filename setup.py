from setuptools import setup, find_packages

setup(
    name="ai_wound",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn[standard]",
        "gunicorn",
        "opencv-python-headless",
        "numpy",
        "torch",
        "torchvision",
        "segmentation-models-pytorch",
        "albumentations",
        "pydantic",
        "python-multipart",
        "scikit-learn",
        "matplotlib"
    ],
)
