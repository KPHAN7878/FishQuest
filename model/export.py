import os
import torch
import torchvision.transforms as T
from ultralytics import YOLO

device = "cuda:0" if torch.cuda.is_available() else "cpu:0"
size = 640

PATH = f"{os.getcwd()}/runs/detect/train/weights/best.pt"


if __name__ == "__main__":
    model = YOLO(PATH)
    model.export(format="onnx", imgsz=[640, 640], opset=12, input_name="input")
