import mongoose from "mongoose";/** * Lidhja me bazën e të dhënave MongoDB. * @param uri - URI i lidhjes me MongoDB. */export async function connectToMongo(uri: string = "mongodb://localhost:27017/ultrawebthinking"): Promise<void> {  try {    await mongoose.connect(uri, {      useNewUrlParser: true,      useUnifiedTopology: true,    });    console.log("✅ Lidhja me MongoDB u realizua me sukses.");  } catch (error) {    console.error("❌ Gabim gjatë lidhjes me MongoDB:", error);    throw error;  }}

/**
 * Mbyll lidhjen me bazën e të dhënave MongoDB.
 */
export async function disconnectFromMongo(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("🔒 Lidhja me MongoDB u mbyll me sukses.");
  } catch (error) {
    console.error("❌ Gabim gjatë mbylljes së lidhjes me MongoDB:", error);
    throw error;
  }
}