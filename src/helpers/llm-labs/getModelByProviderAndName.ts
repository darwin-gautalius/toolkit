import { Model, ModelsPage } from "openai/resources/models";

export function getModelByProviderAndName(
  models: ModelsPage,
  provider: string,
  name: string
): Model {
  const model = models.data.find(
    (model: any) => model.provider === provider && model.name === name
  );
  if (!model) {
    throw new Error(`Model not found: ${provider} ${name}`);
  }
  return model;
}
