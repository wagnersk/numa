// components/TargetForm.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import Feather from "@expo/vector-icons/Feather";

import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Button } from "@/components/Button";
import { formatDate } from "@/utils/formatDate";
import { UnsplashService } from "@/services/UnsplashService";

import { useFocusEffect, useRouter } from "expo-router";
import { useTargetStore } from "@/store/useImageStore";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { usePhotosDatabase } from "@/database/usePhotosDatabase";
import { getRandomColor } from "@/utils/getRandomColor";

import { SafeAreaView } from "react-native-safe-area-context"; 
import { addDays } from "@/utils/addDays";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";

export type TartgetGridProps = {
    id?:number;
    name: string;
    currency: string;
    photo_file_name: string;
    color: string;
    current: number;
    target: number;
    start_date: number;
    end_date: number;
}

interface TargetFormProps {
  editting:boolean
  onEditColor: () => void;
  onEditPhoto: () => void;
  paramsId?: string| undefined;
}

export function TargetForm({
  editting,
  onEditColor,
  onEditPhoto,
  paramsId,
}: TargetFormProps) {
 
    const router = useRouter();
    
    const color = useTargetStore((state) => state.target.color);
    const photo = useTargetStore((state) => state.target.photo);
    const setTempTarget = useTargetStore((state) => state.setTempTarget);
    const resetTempTarget = useTargetStore((state) => state.resetTempTarget);
    
    const targetDatabase = useTargetDatabase();
    const transactionsDatabase = useTransactionsDatabase();
    const photosDatabase = usePhotosDatabase();
  
    const [isLoading, setIsLoading] = useState(false);
    const currenciesArray = ["BRL", "USD", "EUR"];

  
  const [targetData, setTargetData] = useState<TartgetGridProps>({
    name: "",
    currency: "BRL",
    current: 0,
    target: 0,
    start_date: 0,
    end_date: 0,
    color: colors.white,
    photo_file_name: null,
  });


  const [ isFetching, setIsFetching ] = useState(true)

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  function handleSetName(name: string) {
    setTargetData((prev) => ({ ...prev, name }));
  }

  function handleSelectCurrency(currency: string) {
    setTargetData((prev) => ({ ...prev, currency }));
  }

  function handleSelectStartValue(current: number) {
    setTargetData((prev) => ({ ...prev, current }));
  }
 
  function handleSetGoalValue(target: number) {
    setTargetData((prev) => ({ ...prev, target }));
  }

  function handleSetStartDate(start_date: Date) {
    const formattedStartDate = start_date.getTime()
    setTargetData((prev) => ({ ...prev, start_date:formattedStartDate }));
    setStartPickerVisible(false);
  }

  function handleSetEndDate(end_date: Date) {
        const formattedStartDate = end_date.getTime()

    setTargetData((prev) => ({ ...prev, end_date:formattedStartDate }));
    setEndPickerVisible(false);
  }

  async function create(data:TartgetGridProps) {
 
    try {
      setIsLoading(true);

      const photoData = await UnsplashService.downloadPhoto(photo);
 
      const targetId = await targetDatabase.create({
        name: data.name,
        amount: data.target,
        currency: data.currency,
        color: color,
        start_date: data.start_date,
        end_date: data.end_date,
      });

      await transactionsDatabase.create({
        amount: data.current,
        target_id: targetId,
        observation: "Saldo inicial",
      });
 
      await photosDatabase.create({
        target_id: targetId,
        file_name: photoData.file_name,
        color: photoData.color,
        blur_hash: photoData.blur_hash,
        direct_url: photoData.direct_url,
      });

   Alert.alert("Nova Meta", "Meta criada com sucesso!", [
     {
       text: "Ok",
       onPress: () => {
          resetTempTarget();
          clearData()
            router.push("/tabs");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a meta.");
    } finally {
      setIsLoading(false);
    }
  }

 async function update(data: TartgetGridProps) {


  setIsLoading(true);

  try {
    let photoData = null;

    // Se houver nova foto selecionada
    if (photo) {
      photoData = await UnsplashService.downloadPhoto(photo);
      await UnsplashService.deleteLocalPhoto(data.photo_file_name);
    }

    // Atualiza tabela targets
    await targetDatabase.update({
      id: data.id,
      name: data.name,
      amount: data.target,
      currency: data.currency,
      color: color,
      end_date: data.end_date,
    });

    // Atualiza foto se houver nova foto
    console.log(`fora`)
    if (photoData) {
      console.log(`dentro`,{
        id: data.id, // assumindo que o id da foto é igual ao target_id
        file_name: photoData.file_name,
        color: photoData.color,
        blur_hash: photoData.blur_hash,
        direct_url: photoData.direct_url,
      })
      await photosDatabase.update({
        id: data.id, // assumindo que o id da foto é igual ao target_id
        file_name: photoData.file_name,
        color: photoData.color,
        blur_hash: photoData.blur_hash,
        direct_url: photoData.direct_url,
      });
    }


    Alert.alert("Meta Atualizada", "A meta foi atualizada com sucesso!", [
      {
        text: "Ok",
        onPress: () => {
          resetTempTarget();
          clearData();
          router.push("/tabs");
        },
      },
    ]);
  } catch (error) {
    console.log(error);
    Alert.alert("Erro", "Não foi possível atualizar a meta.");
  } finally {
    setIsLoading(false);
  }
}
  
  async function handleSubmit() {
     if (!targetData.name.trim() || Number(targetData.target) <= 0) {
      return Alert.alert("Atenção", "Preencha nome e valor da meta.");
    }

    if (!editting && !photo) {
      Alert.alert("Atenção", "Adicione uma imagem para continuar.");
      return;
    }
    if (editting && targetData.photo_file_name === null) {
      Alert.alert("Atenção", "Adicione uma imagem para continuar.");
      return;
    }
      // 3️⃣ Validar datas
    if (!targetData.start_date || !targetData.end_date) {
      return Alert.alert("Atenção", "Selecione datas válidas para a meta.");
    }
    if (targetData.end_date <= targetData.start_date) {
      return Alert.alert("Atenção", "A data de término deve ser maior que a data de início.");
    }

      if (targetData.current > targetData.target && targetData.current > 0 && targetData.target > 0) {
      return Alert.alert("Atenção", "Valores inválidos para saldo ou objetivo.");
    }


    if(editting ){ 
      await update(targetData)
    
    } else {
      await create(targetData); 

    }
  }

 async function handleDelete() {

  Alert.alert(
    "Atenção",
    "Deseja realmente deletar essa meta?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);

            // 1️⃣ Deletar a foto local
            await UnsplashService.deleteLocalPhoto(targetData.photo_file_name);

            // 2️⃣ Deletar registro da foto no SQLite
            await photosDatabase.remove(Number(targetData.id));

            // 3️⃣ Deletar transações relacionadas
            await transactionsDatabase.remove(Number(targetData.id));

            // 4️⃣ Deletar a meta
            await targetDatabase.remove(Number(targetData.id));

            Alert.alert("Meta deletada com sucesso!");

            // Resetar estado e voltar para a lista
            resetTempTarget();
            clearData();
            router.push("/tabs");
          } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível deletar a meta.");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]
  );
}
 
  async function fetchTarget(): Promise<TartgetGridProps> {
      try {

        const response = await targetDatabase.show(paramsId)
        return {
            id:Number(response.id),
            name: response.name,
            currency: response.currency,
            current:response.current,
            target:response.amount,
            start_date: response.start_date, 
            end_date: response.end_date,
            color: response.color,
            photo_file_name: response.photo_file_name,
        }
    
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as metas.')
        console.log(error)
      }
  }


    async function fetchData() {
      const targetDataPromise = fetchTarget()
      
      const [target] = await Promise.all([
        targetDataPromise,
      ])
      
      
      setTargetData(target) 
      setIsFetching(false)
    }


    async function clearData() {
          setTargetData({
            name: "",
            currency: "BRL",
            current: 0,
            target: 0,
            start_date: 0,
            end_date: 0,
            color: colors.white,
            photo_file_name: '',
          }) 
          setIsFetching(false)
    }
    

    useFocusEffect(
      useCallback(() => {
        if(editting){
          fetchData()
        } 
      }, []),
    )

    useEffect(() => {
      if (!color) {
        setTempTarget({ color: getRandomColor() });
      }

    },[])
 

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[100] }}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}

        <View style={[styles.header, { justifyContent: editting ? "space-between":"center"   }]}>
          {editting && 
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.black} />
            </TouchableOpacity>
          }
          <Text style={styles.title}>{editting ? "Editar Meta" : "Nova Meta"}</Text>
          {editting &&
          <View style={{ width: 24 }} /> 
          }
        </View>

        {/* Nome da meta */}
        <View style={styles.row}>
          <View style={styles.inputSearchWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nome da meta"
              placeholderTextColor={colors.gray[400]}
              value={targetData.name}
              onChangeText={handleSetName}
              maxLength={22}
              editable={!isLoading}
            />
            <View style={styles.inputSearchMaxCounterWrapper}>
              <Text style={styles.charCount}>{targetData.name.length}/22</Text>
            </View>
          </View>

          <View style={styles.editButtonWrapper}>
            <TouchableOpacity
              onPress={onEditColor}
              style={[styles.editButton, { backgroundColor: editting ?targetData.color :  color  }]}
              disabled={isLoading}
            >
              <Feather name="edit-3" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Banner */}
        <TouchableOpacity
          onPress={onEditPhoto}
          style={[styles.bannerUpload, 
            photo && { borderWidth: 0 },
            editting && { flex:1, borderWidth:0 }
          ]}
          disabled={isLoading}
        >
          <View style={styles.bannerTextWrapper}>
            {photo || targetData.photo_file_name ? (
              <Image source={{ uri: photo ? photo.urls.regular : getLocalPhotoUri(targetData.photo_file_name) }} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <>
                <Feather name="image" size={24} color={colors.gray[500]} />
                <Text style={styles.bannerText}>Adicionar Imagem ao Banner</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Seleção de moeda */}

             {!editting &&
              <View style={styles.currencyRow}>
                {currenciesArray.map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    style={[
                      styles.currencyButton,
                      targetData.currency === curr && styles.currencyButtonSelected,
                    ]}
                    onPress={() => handleSelectCurrency(curr)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.currencyText,
                        targetData.currency === curr && styles.currencyTextSelected,
                      ]}
                    >
                      {curr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              }
        {/* Valores e datas */}
        <View>
          {/* Valores */}
          <View style={styles.valuesRow}>
            {!editting &&
            <View style={{ flex: 1 }}>
              <CurrencyInput
                prefix={
                  targetData.currency === "BRL"
                  ? "R$"
                  : targetData.currency === "USD"
                  ? "$"
                  : "€"
                }
                label="Saldo Inicial"
                value={targetData.current}
                onChangeValue={handleSelectStartValue}
                editable={!isLoading}
                />
            </View> }
            <View style={{ flex: 1 }}>
              <CurrencyInput
                prefix={
                  targetData.currency === "BRL"
                    ? "R$"
                    : targetData.currency === "USD"
                    ? "$"
                    : "€"
                }
                label="Objetivo"
                value={targetData.target}
                onChangeValue={handleSetGoalValue}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Datas */}
          <View style={styles.dateRow}>
                 {!editting && 
                
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Início</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setStartPickerVisible(true)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.dateText,
                    targetData.start_date ? styles.dateTextActive : styles.dateTextInactive,
                  ]}
                >
                  {targetData.start_date ? formatDate(new Date(targetData.start_date)) : "Selecionar data"}
                </Text>
              </TouchableOpacity>
            </View>
 }

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Fim</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setEndPickerVisible(true)}
                disabled={isLoading || !targetData.start_date}
              >
                <Text
                  style={[
                    styles.dateText,
                    targetData.end_date ? styles.dateTextActive : styles.dateTextInactive,
                  ]}
                >
                  {targetData.end_date ? formatDate(new Date(targetData.end_date)) : "Selecionar data"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isStartPickerVisible}
            mode="date"
            locale="pt-BR"
            date={new Date()}
            onConfirm={handleSetStartDate}
            onCancel={() => setStartPickerVisible(false)}
            minimumDate={new Date()}
            disabled={isLoading}
          />

          <DateTimePickerModal
            isVisible={isEndPickerVisible}
            mode="date"
            locale="pt-BR"
            date={ addDays(new Date(targetData.start_date), 1)}
            onConfirm={handleSetEndDate}
            onCancel={() => setEndPickerVisible(false)}
           /*  minimumDate={new Date(targetData.start_date) || undefined} */
            minimumDate={
              targetData.start_date
                ? addDays(new Date(targetData.start_date), 1)
                : undefined
            }



            disabled={isLoading || !targetData.start_date}
          />
        </View>

        {/* Botão */}
        <Button title={editting ? "Atualizar" : "Cadastrar"} onPress={handleSubmit} isProcessing={isLoading} />

        {editting &&
        <Button title={'Deletar'} onPress={handleDelete} isProcessing={isLoading} type={'delete'}/>
        }
        
      </KeyboardAvoidingView>
     </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
    width: "100%",
    
  },
  inputSearchWrapper: {
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,
    position: "relative",
    
  },
  inputSearchMaxCounterWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  charCount: {
    fontSize: 12,
    color: colors.black,
    fontFamily: fontFamily.regular,
    marginTop: 4,
    marginBottom: 16,
  },
  editButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
  },
  editButton: {
    backgroundColor: colors.gray[300],
    borderRadius: 50,
    width: 72,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerUpload: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.gray[400],
    borderRadius: 12,
    height: 140,
    marginBottom: 24,
  },
  bannerTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  bannerText: {
    color: colors.gray[500],
    fontFamily: fontFamily.regular,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  currencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  currencyButtonSelected: {
    backgroundColor: colors.black,
  },
  currencyText: {
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  currencyTextSelected: {
    color: colors.white,
  },
  valuesRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  label: {
     color: colors.gray[600],
    fontSize: 16,
    fontFamily: fontFamily.regular,
    marginBottom: 10,
  },
  input: {
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: colors.white,
    height: 48,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  dateText: {
    fontSize: 16,
  },
  dateTextActive: {
    color: colors.gray[900],
  },
  dateTextInactive: {
    color: colors.gray[400],
  },
});