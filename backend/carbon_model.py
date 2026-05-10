import pandas as pd  # type: ignore

from sklearn.linear_model import LinearRegression  # type: ignore

import numpy as np


data = {

    'distance': [

        5, 10, 15, 20, 25,

        30, 35, 40, 45, 50

    ],

    'electricity': [

        2, 3, 4, 5, 6,

        7, 8, 9, 10, 12

    ],

    'emission': [

        2, 4, 6, 9, 11,

        14, 16, 19, 21, 25

    ]

}

df = pd.DataFrame(data)

X = df[[
    'distance',
    'electricity'
]]

y = df['emission']

model = LinearRegression()

model.fit(X, y)


def predict_emission(
    distance,
    electricity
):

    try:

        distance = float(distance)

        electricity = float(electricity)

    except:

        return 0.0


    # NEGATIVE CHECK

    if distance < 0:

        distance = 0


    if electricity < 0:

        electricity = 0


    # PREDICT

    prediction = model.predict([[
        distance,
        electricity
    ]])


    # SAFE OUTPUT

    predicted_value = max(
        0,
        round(float(prediction[0]), 2)
    )


    return predicted_value

if __name__ == '__main__':

    result = predict_emission(
        25,
        6
    )

    print(
        f"Predicted Emission: {result} kg CO2"
    )