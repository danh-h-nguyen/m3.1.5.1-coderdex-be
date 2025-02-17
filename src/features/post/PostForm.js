import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { alpha, Box, Card, Stack } from "@mui/material";
import { Button } from "@mui/material";
// ======
import FTextField from "../../components/form/FTextField";
import { createPost, updatePost } from "./postSlice";
import { FUploadImage } from "../../components/form";
// ======

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

// const defaultValues = {
//   content: "",
//   image: "",
// };

function PostForm({ post, onClose }) {
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      content: post?.content || "",
      image: post?.image || "",
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.post);

  const onSubmit = (data) => {
    if (post) {
      // Update post if it's an existing post
      dispatch(
        updatePost({
          postId: post._id,
          content: data.content,
          image: data.image,
        })
      ).then(() => onClose());
    } else {
      // Create a new post
      dispatch(createPost(data)).then(() => reset());
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (post) {
      // Set the content and image for editing if post exists
      setValue("content", post.content);
      setValue("image", post.image);
    }
  }, [post, setValue]);

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <FTextField
              name="content"
              multiline
              fullWidth
              rows={4}
              placeholder="Share what you are thinking here..."
              sx={{
                "$ fieldset": {
                  borderWidth: `1px !important`,
                  borderColor: alpha("#919EAB", 0.32),
                },
              }}
            />

            {/* <FTextField name="image" placeholder="Image" /> */}
            {/* <input type="file" ref={fileInput} onChange={handleFile} /> */}
            <FUploadImage
              name="image"
              accept="image/*"
              maxSize={3145728} // 3MB
              onDrop={handleDrop}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="small"
                loading={isSubmitting || isLoading}
              >
                {post ? "Update" : "Post"}
              </Button>
            </Box>
          </Stack>
        </form>
      </FormProvider>
    </Card>
  );
}

export default PostForm;
