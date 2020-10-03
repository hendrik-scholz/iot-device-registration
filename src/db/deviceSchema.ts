import mongoose from "mongoose";

const Schema = mongoose.Schema;

function getDeviceSchema() {
  const deviceSchema = new Schema(
    {
      authorization: {
        name: String,
        role: String,
        owner: String,
      },
      geoposition: {
        type: String,
        coordinates: [Number],
      },
      identification: {
        company: String,
        device: String,
        version: String,
        schedule: [
          {
            dateTime: String, // TODO: Date
            description: String,
            _id: false,
          },
        ],
      },
      timestamp: Date,
      uuid: String,
    },
    { typeKey: "$type" }
  ); // https://stackoverflow.com/questions/33846939/mongoose-schema-error-cast-to-string-failed-for-value-when-pushing-object-to

  return deviceSchema;
}

const schema = getDeviceSchema();

schema.index({ geoposition: "2dsphere" }); // DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
const DeviceModel = mongoose.model("device", schema);

export { DeviceModel };
