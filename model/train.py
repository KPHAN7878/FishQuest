from ultralytics import YOLO

if __name__ == "__main__":
    model = YOLO()
    results = model.train(data="data.yaml", epochs=300)
    results = model.val()
