import onnx
import numpy as np
from PIL import Image
import sys
import onnxruntime as ort
import numpy as np
import os
import cv2

PATH = f"{os.getcwd()}/runs/detect/train/weights/best.onnx"
INPUT_SIZE = 640
CLASSES = ['bluegill', 'carp', 'catfish',
           'gar', 'largemouth_bass', 'white_crappie']


def load_image(file):
    image = Image.open(file)
    image = image.convert("RGB")
    orig_image = np.asarray(image)
    image = image.resize((INPUT_SIZE, INPUT_SIZE))
    image = np.asarray(image).transpose(
        2, 0, 1).reshape(1, 3, INPUT_SIZE, INPUT_SIZE)
    image = image.astype(np.float32) / 255

    return orig_image, image


def with_onnx(image, orig_image):
    onnx_model = onnx.load(PATH)
    onnx.checker.check_model(onnx_model)

    ort_sess = ort.InferenceSession(PATH)
    output_names = ort_sess.get_outputs()
    output_names = [i.name for i in output_names]

    # input must be 4 byte float
    raw_output = ort_sess.run(output_names, {'images': image})[0]
    predictions = np.squeeze(raw_output).T
    conf_thresold = 0.01

    # Filter out object confidence scores below threshold
    scores = np.max(predictions[:, 4:], axis=1)
    predictions = predictions[scores > conf_thresold, :]
    scores = scores[scores > conf_thresold]

    # Get the class with the highest confidence
    class_ids = np.argmax(predictions[:, 4:], axis=1)

    # Get bounding boxes for each object
    boxes = predictions[:, :4]

    i = cv2.dnn.NMSBoxes(boxes, scores, 0.5, 0.5)

    image_draw = orig_image.copy()
    for ii in i:
        print(image_draw, boxes[ii], scores[ii], CLASSES[class_ids[ii]])
        image_draw = draw(
            image_draw, boxes[ii], scores[ii], CLASSES[class_ids[ii]])

    # draw(orig_image, boxes[i[0]], scores[i[0]], CLASSES[class_ids[i[0]]])

    image_draw = image_draw[:, :, ::-1]
    cv2.namedWindow("out", cv2.WINDOW_NORMAL)
    cv2.imshow("out", image_draw)
    cv2.waitKey(0)
    cv2.imwrite("./output.jpg", image_draw)


def draw(image_draw, box, score, class_name):
    x_scale = image_draw.shape[1] / INPUT_SIZE
    y_scale = image_draw.shape[0] / INPUT_SIZE

    (cx, cy, w, h) = box
    w = int(w)
    h = int(h)
    tl = (int((cx - w * 0.5) * x_scale), int((cy - h * 0.5) * y_scale))
    br = (int((cx + w * 0.5) * x_scale), int((cy + h * 0.5) * y_scale))

    cv2.rectangle(image_draw, tl, br, (0, 255, 0), 2)
    cv2.putText(image_draw,
                f'{class_name}:{int(score*100)}', (tl[0], tl[1] - 2),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.60, [0, 255, 0],
                thickness=1)

    return image_draw


def main(file):
    orig_size, image = load_image(file)
    with_onnx(image, orig_size)


if __name__ == "__main__":
    main(sys.argv[1])
