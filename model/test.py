import onnx
import numpy as np
from PIL import Image
import sys
import onnxruntime as ort
import numpy as np
import os
import cv2

PATH = f"{os.getcwd()}/runs/detect/train/weights/best.pt"
DATA_DIR = "/home/will/Documents/datasets/fish_dataset/largemouth"
INPUT_SIZE = 640
CLASSES = ['bluegill', 'carp', 'catfish',
           'gar', 'largemouth_bass', 'white_crappie']


def load_image(file):
    image = Image.open(file)
    orig_image = np.asarray(image)
    image = image.resize((INPUT_SIZE, INPUT_SIZE))
    image = np.asarray(image).transpose(
        2, 0, 1).reshape(1, 3, INPUT_SIZE, INPUT_SIZE)
    image = image.astype(np.float32) / 255

    return orig_image, image


def with_onnx(image, orig_image):
    orig_size = orig_image.shape[:2]
    onnx_model = onnx.load(PATH)
    onnx.checker.check_model(onnx_model)
    # print(onnx_model.graph.input)

    ort_sess = ort.InferenceSession(PATH)
    output_names = ort_sess.get_outputs()
    output_names = [i.name for i in output_names]

    # input must be 4 byte float
    raw_output = ort_sess.run(output_names, {'images': image})[0]
    predictions = np.squeeze(raw_output).T
    conf_thresold = 0.8

    # Filter out object confidence scores below threshold
    scores = np.max(predictions[:, 4:], axis=1)
    predictions = predictions[scores > conf_thresold, :]
    scores = scores[scores > conf_thresold]

    # Get the class with the highest confidence
    class_ids = np.argmax(predictions[:, 4:], axis=1)

    # Get bounding boxes for each object
    boxes = predictions[:, :4]

    # rescale box
    print(boxes)
    input_shape = np.array([INPUT_SIZE] * 4)
    boxes = np.divide(boxes, input_shape, dtype=np.float32)
    boxes *= np.array([*orig_size, *orig_size])
    boxes = boxes.astype(np.int32)

    # Apply non-maxima suppression to suppress weak, overlapping bounding boxes
    # indices = nms(boxes, scores, 0.3)
    i = cv2.dnn.NMSBoxes(boxes, scores, 0.5, 0.5)

    print(boxes[i[0]], scores[i[0]], CLASSES[class_ids[i[0]]])
    draw(orig_image, boxes[i[0]], scores[i[0]], CLASSES[class_ids[i[0]]])


def draw(image, box, score, class_name):
    image_draw = image.copy()

    (centerX, centerY, width, height) = box
    box[0] = int(centerX - (width / 2))
    box[1] = int(centerY - (height / 2))
    bbox = box.round().astype(np.int32).tolist()
    color = (0, 255, 0)

    cv2.rectangle(image_draw, tuple(bbox[:2]), tuple(bbox[2:]), color, 2)
    cv2.putText(image_draw,
                f'{class_name}:{int(score*100)}', (bbox[0], bbox[1] - 2),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.60, [225, 255, 255],
                thickness=1)

    image_draw = image_draw[:, :, ::-1]
    cv2.imwrite("output.jpg", image_draw)


def main(file):
    orig_size, image = load_image(file)
    with_onnx(image, orig_size)


if __name__ == "__main__":
    main(sys.argv[1])
